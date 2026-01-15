import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsNumber,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from 'src/generated/prisma/enums';

export class FindAllTransactionsDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  accountId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
