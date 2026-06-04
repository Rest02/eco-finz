import { IsString, IsNumber, IsArray, IsOptional, Min, Max, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SnapshotItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  amount: number;
}

export class CreateMonthlyProjectionDto {
  @IsString()
  name: string;

  @IsString()
  period: string;

  @IsNumber()
  @Min(1)
  @Max(31)
  @Type(() => Number)
  payDay: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  savingsPercentage: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  variableExpensesPercentage: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SnapshotItemDto)
  incomeSnapshot: SnapshotItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SnapshotItemDto)
  fixedExpenseSnapshot: SnapshotItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SnapshotItemDto)
  cardPaymentSnapshot: SnapshotItemDto[];
}
