import { IsArray, IsString } from 'class-validator';

export class UpdateExcludedTransactionsDto {
  @IsArray()
  @IsString({ each: true })
  excludedTransactionIds: string[];
}
