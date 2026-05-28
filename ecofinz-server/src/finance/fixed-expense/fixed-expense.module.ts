import { Module } from '@nestjs/common';
import { FixedExpenseService } from './fixed-expense.service';
import { FixedExpenseController } from './fixed-expense.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FixedExpenseController],
  providers: [FixedExpenseService],
  exports: [FixedExpenseService],
})
export class FixedExpenseModule {}
