import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { BudgetModule } from './budget/budget.module';
import { ProjectionModule } from './projection/projection.module';
import { SavingsGoalModule } from './savings-goal/savings-goal.module';
import { FixedExpenseModule } from './fixed-expense/fixed-expense.module';

@Module({
  imports: [PrismaModule, AccountModule, TransactionModule, BudgetModule, ProjectionModule, SavingsGoalModule, FixedExpenseModule],
  controllers: [FinanceController, CategoryController],
  providers: [FinanceService, CategoryService],
})
export class FinanceModule {}

