import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class FindAllBudgetsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  year?: number;
}
