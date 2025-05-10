import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionService } from '../application/transaction.service';
import { Transaction } from '../domain/transaction.entity';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/infrastructure/decorators/current-user.decorator';
import { AccountService } from '../../accounts/application/account.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction successfully created',
    type: Transaction,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Account does not belong to user',
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async createTransaction(
    @Body() data: CreateTransactionDto,
    @CurrentUser() user: { id: string },
  ): Promise<Transaction> {
    const account = await this.accountService.getAccountById(data.accountId);
    if (!account) throw new NotFoundException('Account not found');

    if (account.userId !== user.id)
      throw new ForbiddenException('Account does not belong to user');

    return this.transactionService.createTransaction(
      data.accountId,
      data.type,
      data.amount,
      data.category,
      data.description,
      data.date,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
    type: Transaction,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Transaction does not belong to user',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTransaction(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<Transaction | null> {
    const transaction = await this.transactionService.getTransactionById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const account = await this.accountService.getAccountById(
      transaction.accountId,
    );
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.userId !== user.id) {
      throw new ForbiddenException('Transaction does not belong to user');
    }

    return transaction;
  }

  @Get('account/:accountId')
  @ApiOperation({ summary: 'Get all transactions for an account' })
  @ApiParam({ name: 'accountId', description: 'Account ID' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: [Transaction],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Account does not belong to user',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAccountTransactions(
    @Param('accountId') accountId: string,
    @CurrentUser() user: { id: string },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Transaction[]> {
    const account = await this.accountService.getAccountById(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.userId !== user.id) {
      throw new ForbiddenException('Account does not belong to user');
    }

    if (startDate && endDate) {
      return this.transactionService.getAccountTransactionsByDateRange(
        accountId,
        new Date(startDate),
        new Date(endDate),
      );
    }
    return this.transactionService.getAccountTransactions(accountId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
    type: Transaction,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Transaction does not belong to user',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateTransaction(
    @Param('id') id: string,
    @Body() updates: UpdateTransactionDto,
    @CurrentUser() user: { id: string },
  ): Promise<Transaction> {
    const transaction = await this.transactionService.getTransactionById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const account = await this.accountService.getAccountById(
      transaction.accountId,
    );
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.userId !== user.id) {
      throw new ForbiddenException('Transaction does not belong to user');
    }

    return this.transactionService.updateTransaction(id, updates);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Transaction does not belong to user',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteTransaction(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<void> {
    const transaction = await this.transactionService.getTransactionById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const account = await this.accountService.getAccountById(
      transaction.accountId,
    );
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.userId !== user.id) {
      throw new ForbiddenException('Transaction does not belong to user');
    }

    return this.transactionService.deleteTransaction(id);
  }
}
