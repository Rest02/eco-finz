import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
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
}
