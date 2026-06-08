import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateSpendingPlanDto {
  @IsOptional()
  variableExpensesAccountId?: any;

  @IsOptional()
  @IsString()
  spendingPlanPattern?: string;

  @IsOptional()
  @IsString()
  spendingDays?: string;

  @IsOptional()
  @IsString()
  variableExpenseDistribution?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  variableExpenseWeeks?: number;
}
