import {
  IsString,
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class PayCreditCardDto {
  @IsString()
  @IsNotEmpty()
  creditCardAccountId: string;

  @IsString()
  @IsNotEmpty()
  sourceAccountId: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
