export enum AccountType {
  BANK = 'BANK',
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
}

export interface IAccount {
  id: string;
  accountName: string;
  accountType?: AccountType;
  initialBalance: number;
  balance: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Account implements IAccount {
  id: string;
  accountName: string;
  accountType?: AccountType;
  initialBalance: number;
  balance: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<IAccount>) {
    Object.assign(this, partial);
  }

  updateBalance(amount: number): void {
    this.balance += amount;
    this.updatedAt = new Date();
  }
}
