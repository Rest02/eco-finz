import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionType } from 'src/generated/prisma/client';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) { }

  async getSummary(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const budgets = await this.prisma.budget.findMany({
      where: {
        userId,
        monthlySummary: {
          year,
          month,
        },
      },
    });

    const categories = await this.prisma.category.findMany({
      where: {
        userId,
      },
    });

    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INGRESO)
      .reduce((sum, t) => sum + t.amount.toNumber(), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === TransactionType.EGRESO)
      .reduce((sum, t) => sum + t.amount.toNumber(), 0);

    const totalSavings = transactions
      .filter((t) => t.type === TransactionType.AHORRO && !t.isInflow)
      .reduce((sum, t) => sum + t.amount.toNumber(), 0);

    const totalInvestments = transactions
      .filter((t) => t.type === TransactionType.INVERSION)
      .reduce((sum, t) => sum + t.amount.toNumber(), 0);

    const balance = totalIncome - totalExpenses;

    const budgetMap = new Map<string, number>();
    budgets.forEach((b) => {
      const current = budgetMap.get(b.categoryId) || 0;
      budgetMap.set(b.categoryId, current + b.amount.toNumber());
    });
    const expenseMap = new Map<string, number>();

    transactions
      .filter((t) => t.type === TransactionType.EGRESO)
      .forEach((t) => {
        const currentSpent = expenseMap.get(t.categoryId) || 0;
        expenseMap.set(t.categoryId, currentSpent + t.amount.toNumber());
      });

    const categorySummaries = categories.map((c) => {
      const budgeted = budgetMap.get(c.id) || 0;
      const spent = expenseMap.get(c.id) || 0;
      return {
        categoryId: c.id,
        categoryName: c.name,
        budgeted,
        spent,
        remaining: budgeted - spent,
      };
    });

    return {
      totalIncome,
      totalExpenses,
      totalSavings,
      totalInvestments,
      balance,
      categorySummaries,
    };
  }
}
