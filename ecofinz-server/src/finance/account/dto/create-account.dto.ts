import { IsString, IsEnum, IsNumber, IsOptional, Min, Max, IsBoolean } from 'class-validator';
import { AccountType } from '../../../generated/prisma/enums';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsEnum(AccountType)
  type: AccountType;

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

  @IsBoolean()
  @IsOptional()
  isSavingsAccount?: boolean;
}
