import { PartialType } from '@nestjs/mapped-types';
import { CreateFixedExpenseDto } from './create-fixed-expense.dto';

export class UpdateFixedExpenseDto extends PartialType(CreateFixedExpenseDto) {}
