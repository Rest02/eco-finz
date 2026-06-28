import { IsArray, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class WeekAdjustmentDto {
  @IsNumber()
  @Min(0)
  sourceWeekIndex: number;

  @IsNumber()
  @Min(0)
  targetWeekIndex: number;

  @IsNumber()
  @Min(1)
  amount: number;
}

export class UpdateWeeklyAdjustmentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeekAdjustmentDto)
  adjustments: WeekAdjustmentDto[];
}
