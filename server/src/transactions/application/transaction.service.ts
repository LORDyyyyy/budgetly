import { Inject, Injectable } from '@nestjs/common';
import {
  Transaction,
  TransactionType,
  Category,
  ITransaction,
} from '../domain/transaction.entity';
import { ITransactionRepository } from '../domain/transaction.repository.interface';
import { AccountService } from '../../accounts/application/account.service';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('IAccountRepository')
    private readonly accountService: AccountService,
  ) {}

  async createTransaction(
    accountId: string,
    type: TransactionType,
    amount: number,
    category: Category,
    description?: string,
    date?: Date,
  ): Promise<Transaction> {
    const account = await this.accountService.getAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const transaction: Partial<ITransaction> = {
      type,
      amount,
      category,
      description,
      date: date || new Date(),
      accountId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdTransaction =
      await this.transactionRepository.create(transaction);

    const balanceChange = type === TransactionType.INCOME ? amount : -amount;
    await this.accountService.updateAccount(accountId, {
      balance: account.balance + balanceChange,
    });

    return createdTransaction;
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findById(id);
  }

  async getAccountTransactions(accountId: string): Promise<Transaction[]> {
    return this.transactionRepository.findByAccountId(accountId);
  }

  async getAccountTransactionsByDateRange(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findByAccountIdAndDateRange(
      accountId,
      startDate,
      endDate,
    );
  }

  async updateTransaction(
    id: string,
    updates: Partial<ITransaction>,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (updates.amount || updates.type) {
      const account = await this.accountService.getAccountById(
        transaction.accountId,
      );
      if (!account) {
        throw new Error('Account not found');
      }

      const oldBalanceChange =
        transaction.type === TransactionType.INCOME
          ? -transaction.amount
          : transaction.amount;

      const newType = updates.type || transaction.type;
      const newAmount = updates.amount || transaction.amount;
      const newBalanceChange =
        newType === TransactionType.INCOME ? newAmount : -newAmount;

      await this.accountService.updateAccount(transaction.accountId, {
        balance: account.balance + oldBalanceChange + newBalanceChange,
      });
    }

    return this.transactionRepository.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const account = await this.accountService.getAccountById(
      transaction.accountId,
    );
    if (!account) {
      throw new Error('Account not found');
    }

    const balanceChange =
      transaction.type === TransactionType.INCOME
        ? -transaction.amount
        : transaction.amount;

    await this.accountService.updateAccount(transaction.accountId, {
      balance: account.balance + balanceChange,
    });

    return this.transactionRepository.delete(id);
  }
}
