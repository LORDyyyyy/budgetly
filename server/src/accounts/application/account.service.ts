import { Inject, Injectable } from '@nestjs/common';
import { Account, AccountType, IAccount } from '../domain/account.entity';
import { IAccountRepository } from '../domain/account.repository.interface';

@Injectable()
export class AccountService {
  constructor(
    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository,
  ) {}

  async createAccount(
    userId: string,
    accountName: string,
    accountType: AccountType,
    initialBalance: number,
  ): Promise<Account> {
    const account: Partial<IAccount> = {
      accountName,
      accountType,
      initialBalance,
      balance: initialBalance,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.accountRepository.create(account);
  }

  async getAccountById(id: string): Promise<Account | null> {
    return this.accountRepository.findById(id);
  }

  async getUserAccounts(userId: string): Promise<Account[]> {
    return this.accountRepository.findByUserId(userId);
  }

  async updateAccount(
    id: string,
    updates: Partial<IAccount>,
  ): Promise<Account> {
    return this.accountRepository.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteAccount(id: string): Promise<void> {
    return this.accountRepository.delete(id);
  }
}
