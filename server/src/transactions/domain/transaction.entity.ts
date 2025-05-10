export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

export enum Category {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  OTHER = 'OTHER',
  EDUCATION = 'EDUCATION',
  HEALTHCARE = 'HEALTHCARE',
}

export interface ITransaction {
  id: string;
  type?: TransactionType;
  amount: number;
  category?: Category;
  description?: string;
  date: Date;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Transaction implements ITransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description?: string;
  date: Date;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ITransaction>) {
    if (
      partial.type &&
      !Object.values(TransactionType).includes(partial.type)
    ) {
      throw new Error('Invalid transaction type');
    }
    if (
      partial.category &&
      !Object.values(Category).includes(partial.category)
    ) {
      throw new Error('Invalid category');
    }
    Object.assign(this, partial);
  }
}
