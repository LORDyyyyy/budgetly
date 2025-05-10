import { Module } from '@nestjs/common';
import { TransactionController } from './presentation/transaction.controller';
import { TransactionService } from './application/transaction.service';
import { PrismaTransactionRepository } from './infrastructure/prisma-transaction.repository';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsModule } from '../accounts/accounts.module';
import { PrismaAccountRepository } from 'src/accounts/infrastructure/prisma-account.repository';

@Module({
  imports: [AccountsModule],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: 'ITransactionRepository',
      useClass: PrismaTransactionRepository,
    },
    {
      provide: 'IAccountRepository',
      useClass: PrismaAccountRepository,
    },
    PrismaService,
  ],
  exports: [TransactionService],
})
export class TransactionsModule {}
