import { Account, IAccount } from './account.entity';

export interface IAccountRepository {
  create(account: Partial<IAccount>): Promise<Account>;
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account[]>;
  update(id: string, account: Partial<IAccount>): Promise<Account>;
  delete(id: string): Promise<void>;
}
