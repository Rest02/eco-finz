import { IsString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
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
}
