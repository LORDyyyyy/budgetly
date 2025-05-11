import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  IsDateString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType, Category } from '../../domain/transaction.entity';

export class UpdateTransactionDto {
  @ApiPropertyOptional({ enum: TransactionType })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ enum: Category })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: Date;
}
