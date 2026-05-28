import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionType, AccountType } from 'src/generated/prisma/enums';

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

  async getIncomeProjection(userId: string, period: string) {
    const now = new Date();
    let startDate: Date;
    let periodMonths: number;

    switch (period) {
      case 'current':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        periodMonths = 1;
        break;
      case '3m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        periodMonths = 3;
        break;
      case '6m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        periodMonths = 6;
        break;
      default:
        throw new BadRequestException('Invalid period. Use: current, 3m, or 6m');
    }

    const allowedAccountTypes = [AccountType.BANCO, AccountType.BILLETERA_DIGITAL];

    const accounts = await this.prisma.account.findMany({
      where: { userId, type: { in: allowedAccountTypes } },
    });

    if (accounts.length === 0) {
      return { averageIncome: 0, periodMonths, transactionCount: 0, accountCount: 0 };
    }

    const accountIds = accounts.map((a) => a.id);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: TransactionType.INGRESO,
        accountId: { in: accountIds },
        date: { gte: startDate },
      },
    });

    const totalIncome = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const averageIncome = periodMonths > 0 ? totalIncome / periodMonths : 0;

    return {
      averageIncome: Math.round(averageIncome * 100) / 100,
      totalIncome: Math.round(totalIncome * 100) / 100,
      periodMonths,
      transactionCount: transactions.length,
      accountCount: accounts.length,
      periodLabel:
        period === 'current'
          ? 'Mes Actual'
          : period === '3m'
            ? 'Promedio 3 Meses'
            : 'Promedio 6 Meses',
    };
  }
}
