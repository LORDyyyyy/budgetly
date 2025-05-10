import { Module } from '@nestjs/common';
import { AccountController } from './presentation/account.controller';
import { AccountService } from './application/account.service';
import { PrismaAccountRepository } from './infrastructure/prisma-account.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    {
      provide: 'IAccountRepository',
      useClass: PrismaAccountRepository,
    },
    PrismaService,
  ],
  exports: [AccountService],
})
export class AccountsModule {}
