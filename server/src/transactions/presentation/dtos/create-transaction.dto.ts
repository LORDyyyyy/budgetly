import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDate,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType, Category } from '../../domain/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Account ID' })
  @IsString()
  accountId: string;

  @ApiProperty({ enum: TransactionType, description: 'Transaction type' })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ description: 'Transaction amount' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ enum: Category, description: 'Transaction category' })
  @IsEnum(Category)
  category: Category;

  @ApiPropertyOptional({ description: 'Transaction description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Transaction date' })
  @IsOptional()
  @IsDate()
  date?: Date;
}
