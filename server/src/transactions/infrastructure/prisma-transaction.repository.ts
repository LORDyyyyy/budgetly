import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Transaction,
  ITransaction,
  TransactionType,
  Category,
} from '../domain/transaction.entity';
import { ITransactionRepository } from '../domain/transaction.repository.interface';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transaction: Partial<ITransaction>): Promise<Transaction> {
    if (
      !transaction.type ||
      !transaction.amount ||
      !transaction.category ||
      !transaction.accountId
    ) {
      throw new Error('Missing required fields');
    }

    const createdTransaction = await this.prisma.transaction.create({
      data: {
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date || new Date(),
        accountId: transaction.accountId,
      },
    });
    return new Transaction({
      id: createdTransaction.id,
      type: createdTransaction.type as TransactionType,
      amount: createdTransaction.amount,
      category: createdTransaction.category as Category,
      description: createdTransaction.description || '',
      date: createdTransaction.date,
      accountId: createdTransaction.accountId,
      createdAt: createdTransaction.createdAt,
      updatedAt: createdTransaction.updatedAt,
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    return transaction
      ? new Transaction({
          id: transaction.id,
          type: transaction.type as TransactionType,
          amount: transaction.amount,
          category: transaction.category as Category,
          description: transaction.description || '',
          date: transaction.date,
          accountId: transaction.accountId,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        })
      : null;
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { accountId },
      orderBy: { date: 'desc' },
    });
    return transactions.map(
      (transaction) =>
        new Transaction({
          id: transaction.id,
          type: transaction.type as TransactionType,
          amount: transaction.amount,
          category: transaction.category as Category,
          description: transaction.description || '',
          date: transaction.date,
          accountId: transaction.accountId,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        }),
    );
  }

  async findByAccountIdAndDateRange(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        accountId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });
    return transactions.map(
      (transaction) =>
        new Transaction({
          id: transaction.id,
          type: transaction.type as TransactionType,
          amount: transaction.amount,
          category: transaction.category as Category,
          description: transaction.description || '',
        }),
    );
  }

  async update(
    id: string,
    transaction: Partial<ITransaction>,
  ): Promise<Transaction> {
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
      },
    });
    return new Transaction({
      id: updatedTransaction.id,
      type: updatedTransaction.type as TransactionType,
      amount: updatedTransaction.amount,
      category: updatedTransaction.category as Category,
      description: updatedTransaction.description || '',
      date: updatedTransaction.date,
      accountId: updatedTransaction.accountId,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    });
  }
}
