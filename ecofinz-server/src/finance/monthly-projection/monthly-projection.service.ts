import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMonthlyProjectionDto } from './dto/create-monthly-projection.dto';
import { UpdateMonthlyProjectionDto } from './dto/update-monthly-projection.dto';
import { UpdateSpendingPlanDto } from './dto/update-spending-plan.dto';
import { QueryMonthlyProjectionDto } from './dto/query-monthly-projection.dto';
import { ProjectionStatus } from 'src/generated/prisma/enums';

@Injectable()
export class MonthlyProjectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateMonthlyProjectionDto) {
    const totalSelectedIncome = dto.incomeSnapshot.reduce((sum, i) => sum + i.amount, 0);
    const totalFixedExpenses = dto.fixedExpenseSnapshot.reduce((sum, i) => sum + i.amount, 0);
    const totalCardPayments = dto.cardPaymentSnapshot.reduce((sum, i) => sum + i.amount, 0);
    const realAvailableMoney = totalSelectedIncome - totalFixedExpenses - totalCardPayments;
    const projectedSavings = Math.round(totalSelectedIncome * (dto.savingsPercentage / 100));
    const projectedVariableExpenses = Math.round(totalSelectedIncome * (dto.variableExpensesPercentage / 100));

    return this.prisma.monthlyProjection.create({
      data: {
        name: dto.name,
        period: dto.period,
        payDay: dto.payDay,
        totalSelectedIncome,
        totalFixedExpenses,
        totalCardPayments,
        realAvailableMoney,
        savingsPercentage: dto.savingsPercentage,
        variableExpensesPercentage: dto.variableExpensesPercentage,
        projectedSavings,
        projectedVariableExpenses,
        variableExpensesAccountId: dto.variableExpensesAccountId,
        userId,
        incomeSnapshot: {
          create: dto.incomeSnapshot,
        },
        fixedExpenseSnapshot: {
          create: dto.fixedExpenseSnapshot,
        },
        cardPaymentSnapshot: {
          create: dto.cardPaymentSnapshot,
        },
      },
      include: {
        incomeSnapshot: true,
        fixedExpenseSnapshot: true,
        cardPaymentSnapshot: true,
      },
    });
  }

  async findAll(userId: string, query: QueryMonthlyProjectionDto) {
    const where: any = { userId };

    if (query.status) {
      where.status = query.status;
    } else {
      where.status = { not: ProjectionStatus.DELETED };
    }

    if (query.month && query.year) {
      where.period = `${query.year}-${String(query.month).padStart(2, '0')}`;
    } else if (query.year) {
      where.period = { startsWith: `${query.year}-` };
    }

    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }

    return this.prisma.monthlyProjection.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const projection = await this.prisma.monthlyProjection.findUnique({
      where: { id },
      include: {
        incomeSnapshot: true,
        fixedExpenseSnapshot: true,
        cardPaymentSnapshot: true,
        variableExpensesAccount: true,
      },
    });

    if (!projection) {
      throw new NotFoundException('Monthly projection not found');
    }

    if (projection.userId !== userId) {
      throw new ForbiddenException('You do not own this projection');
    }

    return projection;
  }

  async update(userId: string, id: string, dto: UpdateMonthlyProjectionDto) {
    const current = await this.findOne(userId, id);

    const updateData: any = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.period !== undefined) updateData.period = dto.period;
    if (dto.payDay !== undefined) updateData.payDay = dto.payDay;
    if (dto.savingsPercentage !== undefined) updateData.savingsPercentage = dto.savingsPercentage;
    if (dto.variableExpensesPercentage !== undefined) updateData.variableExpensesPercentage = dto.variableExpensesPercentage;
    if (dto.variableExpensesAccountId !== undefined) updateData.variableExpensesAccountId = dto.variableExpensesAccountId;

    const incomes = dto.incomeSnapshot || current.incomeSnapshot.map(i => ({ name: i.name, amount: Number(i.amount) }));
    const expenses = dto.fixedExpenseSnapshot || current.fixedExpenseSnapshot.map(i => ({ name: i.name, amount: Number(i.amount) }));
    const cards = dto.cardPaymentSnapshot || current.cardPaymentSnapshot.map(i => ({ name: i.name, amount: Number(i.amount) }));

    const totalSelectedIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalFixedExpenses = expenses.reduce((s, i) => s + i.amount, 0);
    const totalCardPayments = cards.reduce((s, i) => s + i.amount, 0);
    const realAvailableMoney = totalSelectedIncome - totalFixedExpenses - totalCardPayments;
    const savingsPct = dto.savingsPercentage ?? Number(current.savingsPercentage);
    const variablePct = dto.variableExpensesPercentage ?? Number(current.variableExpensesPercentage);

    updateData.totalSelectedIncome = totalSelectedIncome;
    updateData.totalFixedExpenses = totalFixedExpenses;
    updateData.totalCardPayments = totalCardPayments;
    updateData.realAvailableMoney = realAvailableMoney;
    updateData.projectedSavings = Math.round(totalSelectedIncome * (savingsPct / 100));
    updateData.projectedVariableExpenses = Math.round(totalSelectedIncome * (variablePct / 100));

    const snapshotOps: any[] = [];

    if (dto.incomeSnapshot) {
      snapshotOps.push(
        this.prisma.monthlyProjectionIncome.deleteMany({ where: { projectionId: id } }),
        this.prisma.monthlyProjectionIncome.createMany({
          data: dto.incomeSnapshot.map(i => ({ ...i, projectionId: id })),
        }),
      );
    }

    if (dto.fixedExpenseSnapshot) {
      snapshotOps.push(
        this.prisma.monthlyProjectionFixedExpense.deleteMany({ where: { projectionId: id } }),
        this.prisma.monthlyProjectionFixedExpense.createMany({
          data: dto.fixedExpenseSnapshot.map(i => ({ ...i, projectionId: id })),
        }),
      );
    }

    if (dto.cardPaymentSnapshot) {
      snapshotOps.push(
        this.prisma.monthlyProjectionCardPayment.deleteMany({ where: { projectionId: id } }),
        this.prisma.monthlyProjectionCardPayment.createMany({
          data: dto.cardPaymentSnapshot.map(i => ({ ...i, projectionId: id })),
        }),
      );
    }

    await this.prisma.$transaction([
      this.prisma.monthlyProjection.update({
        where: { id },
        data: updateData,
      }),
      ...snapshotOps,
    ]);

    return this.findOne(userId, id);
  }

  async duplicate(userId: string, id: string) {
    const original = await this.findOne(userId, id);

    return this.prisma.monthlyProjection.create({
      data: {
        name: `${original.name} (copia)`,
        period: original.period,
        payDay: original.payDay,
        totalSelectedIncome: original.totalSelectedIncome,
        totalFixedExpenses: original.totalFixedExpenses,
        totalCardPayments: original.totalCardPayments,
        realAvailableMoney: original.realAvailableMoney,
        savingsPercentage: original.savingsPercentage,
        variableExpensesPercentage: original.variableExpensesPercentage,
        projectedSavings: original.projectedSavings,
        projectedVariableExpenses: original.projectedVariableExpenses,
        userId,
        incomeSnapshot: {
          create: original.incomeSnapshot.map(i => ({ name: i.name, amount: i.amount })),
        },
        fixedExpenseSnapshot: {
          create: original.fixedExpenseSnapshot.map(i => ({ name: i.name, amount: i.amount })),
        },
        cardPaymentSnapshot: {
          create: original.cardPaymentSnapshot.map(i => ({ name: i.name, amount: i.amount })),
        },
      },
      include: {
        incomeSnapshot: true,
        fixedExpenseSnapshot: true,
        cardPaymentSnapshot: true,
      },
    });
  }

  async updateSpendingPlan(userId: string, id: string, dto: UpdateSpendingPlanDto) {
    await this.findOne(userId, id);

    const updateData: any = {};
    if (dto.variableExpensesAccountId !== undefined) {
      updateData.variableExpensesAccountId = dto.variableExpensesAccountId === '' ? null : dto.variableExpensesAccountId;
    }
    if (dto.spendingPlanPattern !== undefined) updateData.spendingPlanPattern = dto.spendingPlanPattern;
    if (dto.spendingDays !== undefined) updateData.spendingDays = dto.spendingDays;
    if (dto.variableExpenseDistribution !== undefined) updateData.variableExpenseDistribution = dto.variableExpenseDistribution;
    if (dto.variableExpenseWeeks !== undefined) updateData.variableExpenseWeeks = dto.variableExpenseWeeks;

    return this.prisma.monthlyProjection.update({
      where: { id },
      data: updateData,
      include: {
        incomeSnapshot: true,
        fixedExpenseSnapshot: true,
        cardPaymentSnapshot: true,
        variableExpensesAccount: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.monthlyProjection.update({
      where: { id },
      data: { status: ProjectionStatus.DELETED },
    });
  }
}
