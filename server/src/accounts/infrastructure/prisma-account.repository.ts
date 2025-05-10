import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Account, AccountType } from '../domain/account.entity';
import { IAccountRepository } from '../domain/account.repository.interface';

@Injectable()
export class PrismaAccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(account: Partial<Account>): Promise<Account> {
    if (!account.accountName || !account.accountType || !account.userId) {
      throw new Error('Missing required fields');
    }

    const createdAccount = await this.prisma.account.create({
      data: {
        accountName: account.accountName,
        accountType: account.accountType,
        initialBalance: account.initialBalance ?? 0,
        balance: account.balance ?? account.initialBalance ?? 0,
        userId: account.userId,
      },
    });

    return new Account({
      id: createdAccount.id,
      accountName: createdAccount.accountName,
      accountType: createdAccount.accountType as AccountType,
      initialBalance: createdAccount.initialBalance,
      balance: createdAccount.balance,
      userId: createdAccount.userId,
      createdAt: createdAccount.createdAt,
      updatedAt: createdAccount.updatedAt,
    });
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });
    return account
      ? new Account({
          id: account.id,
          accountName: account.accountName,
          initialBalance: account.initialBalance,
          balance: account.balance,
          userId: account.userId,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
        })
      : null;
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany({
      where: { userId },
    });
    return accounts.map(
      (account) =>
        new Account({
          id: account.id,
          accountName: account.accountName,
          accountType: account.accountType as AccountType,
          initialBalance: account.initialBalance,
          balance: account.balance,
          userId: account.userId,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
        }),
    );
  }

  async update(id: string, account: Partial<Account>): Promise<Account> {
    const updatedAccount = await this.prisma.account.update({
      where: { id },
      data: {
        accountName: account.accountName,
        accountType: account.accountType,
        initialBalance: account.initialBalance,
        balance: account.balance,
      },
    });
    return new Account({
      id: updatedAccount.id,
      accountName: updatedAccount.accountName,
      accountType: updatedAccount.accountType as AccountType,
      initialBalance: updatedAccount.initialBalance,
      balance: updatedAccount.balance,
      userId: updatedAccount.userId,
      createdAt: updatedAccount.createdAt,
      updatedAt: updatedAccount.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.account.delete({
      where: { id },
    });
  }
}
