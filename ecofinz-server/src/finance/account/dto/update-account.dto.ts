import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { IsEnum, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { AccountType } from '../../../generated/prisma/enums';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(AccountType)
  @IsOptional()
  type?: AccountType;

  @IsNumber()
  @IsOptional()
  @Min(0)
  balance?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  creditLimit?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(31)
  closingDay?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(31)
  dueDay?: number;

  @IsString()
  @IsOptional()
  lastDigits?: string;

  @IsString()
  @IsOptional()
  color?: string;
}
