import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  @IsPositive()
  year: number;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}

