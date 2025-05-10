import { Transaction, ITransaction } from './transaction.entity';

export interface ITransactionRepository {
  create(transaction: Partial<ITransaction>): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  findByAccountIdAndDateRange(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]>;
  update(id: string, transaction: Partial<ITransaction>): Promise<Transaction>;
  delete(id: string): Promise<void>;
}
