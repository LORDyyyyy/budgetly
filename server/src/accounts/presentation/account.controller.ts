import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from '../application/account.service';
import { Account, AccountType, IAccount } from '../domain/account.entity';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/infrastructure/decorators/current-user.decorator';
import {
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountName: { type: 'string', example: 'My Bank Account' },
        accountType: {
          type: 'string',
          enum: Object.values(AccountType),
          example: AccountType.BANK,
        },
        initialBalance: { type: 'number', example: 1000 },
      },
      required: ['accountName', 'accountType', 'initialBalance'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Account successfully created',
    type: Account,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createAccount(
    @Body()
    data: {
      accountName: string;
      accountType: AccountType;
      initialBalance: number;
    },
    @CurrentUser() user: { id: string },
  ): Promise<Account> {
    return this.accountService.createAccount(
      user.id,
      data.accountName,
      data.accountType,
      data.initialBalance,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiParam({ name: 'id', description: 'Account ID' })
  @ApiResponse({
    status: 200,
    description: 'Account found',
    type: Account,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAccount(@Param('id') id: string): Promise<Account | null> {
    return this.accountService.getAccountById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of user accounts',
    type: [Account],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserAccounts(
    @CurrentUser() user: { id: string },
  ): Promise<Account[]> {
    return this.accountService.getUserAccounts(user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update account' })
  @ApiParam({ name: 'id', description: 'Account ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountName: { type: 'string', example: 'Updated Account Name' },
        accountType: {
          type: 'string',
          enum: Object.values(AccountType),
          example: AccountType.BANK,
        },
        initialBalance: { type: 'number', example: 2000 },
        balance: { type: 'number', example: 2000 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Account updated successfully',
    type: Account,
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateAccount(
    @Param('id') id: string,
    @Body() updates: Partial<IAccount>,
  ): Promise<Account> {
    return this.accountService.updateAccount(id, updates);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiParam({ name: 'id', description: 'Account ID' })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteAccount(@Param('id') id: string) {
    await this.accountService.deleteAccount(id);

    return {
      message: 'Ok',
    };
  }
}
