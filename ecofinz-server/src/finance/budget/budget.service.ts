import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { FindAllBudgetsDto } from './dto/find-all-budgets.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createBudgetDto: CreateBudgetDto, userId: string) {
    const { categoryId, month, year, amount, name, description } =
      createBudgetDto;

    // 1. Validar que la categoría existe y pertenece al usuario
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      throw new NotFoundException(
        'La categoría no existe o no pertenece al usuario.',
      );
    }

    // 2. Encontrar o crear el MonthlySummary
    let monthlySummary = await this.prisma.monthlySummary.findUnique({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
    });

    if (!monthlySummary) {
      monthlySummary = await this.prisma.monthlySummary.create({
        data: {
          userId,
          month,
          year,
        },
      });
    }

    // 3. Verificar que no exista un presupuesto con el mismo nombre para el mismo mes/año
    const existingBudget = await this.prisma.budget.findFirst({
      where: {
        name,
        monthlySummaryId: monthlySummary.id,
        userId,
      },
    });

    if (existingBudget) {
      throw new ConflictException(
        'Ya existe un presupuesto con este nombre para el mes y año seleccionados.',
      );
    }

    // 4. Crear el presupuesto
    return this.prisma.budget.create({
      data: {
        name,
        description,
        amount,
        userId,
        categoryId,
        monthlySummaryId: monthlySummary.id,
      },
    });
  }

  async findAll(userId: string, query: FindAllBudgetsDto) {
    const { month, year } = query;
    const where: Prisma.BudgetWhereInput = {
      userId,
    };

    if (month && year) {
      where.monthlySummary = {
        month,
        year,
      };
    } else if (month) {
      where.monthlySummary = {
        month,
      };
    } else if (year) {
      where.monthlySummary = {
        year,
      };
    }

    const budgets = await this.prisma.budget.findMany({
      where,
      include: {
        category: true,
        monthlySummary: true,
        transactions: {
          select: {
            amount: true,
            isInflow: true,
          },
        },
      },
    });

    return budgets.map((budget) => {
      const spent = budget.transactions.reduce((acc, t) => {
        const amount = t.amount.toNumber();
        return t.isInflow ? acc - amount : acc + amount;
      }, 0);

      const { transactions, ...rest } = budget;
      return { ...rest, spent };
    });
  }

  async findOne(id: string, userId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
      include: {
        category: true,
        monthlySummary: true,
        transactions: {
          select: {
            amount: true,
            isInflow: true,
          },
        },
      },
    });

    if (!budget) {
      throw new NotFoundException('Presupuesto no encontrado.');
    }

    const spent = budget.transactions.reduce((acc, t) => {
      const amount = t.amount.toNumber();
      return t.isInflow ? acc - amount : acc + amount;
    }, 0);

    const { transactions, ...rest } = budget;
    return { ...rest, spent };
  }

  async update(id: string, userId: string, updateBudgetDto: UpdateBudgetDto) {
    const { categoryId, month, year, name } = updateBudgetDto;

    // 1. Verificar que el presupuesto existe y pertenece al usuario
    const existingBudget = await this.prisma.budget.findFirst({
      where: { id, userId },
      include: { monthlySummary: true },
    });

    if (!existingBudget) {
      throw new NotFoundException(
        'El presupuesto no existe o no pertenece al usuario.',
      );
    }

    // 2. Validar nueva categoría si se provee
    if (categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: categoryId, userId },
      });
      if (!category) {
        throw new NotFoundException(
          'La nueva categoría no existe o no pertenece al usuario.',
        );
      }
    }

    const dataToUpdate: Prisma.BudgetUpdateInput = {
      ...updateBudgetDto,
    };

    // 3. Manejar actualización de mes/año
    const needsMonthlySummaryUpdate = month || year;
    let targetMonthlySummaryId = existingBudget.monthlySummaryId;

    if (needsMonthlySummaryUpdate) {
      const targetMonth = month || existingBudget.monthlySummary.month;
      const targetYear = year || existingBudget.monthlySummary.year;

      let monthlySummary = await this.prisma.monthlySummary.findUnique({
        where: {
          userId_month_year: {
            userId,
            month: targetMonth,
            year: targetYear,
          },
        },
      });

      if (!monthlySummary) {
        monthlySummary = await this.prisma.monthlySummary.create({
          data: {
            userId,
            month: targetMonth,
            year: targetYear,
          },
        });
      }
      dataToUpdate.monthlySummary = { connect: { id: monthlySummary.id } };
      targetMonthlySummaryId = monthlySummary.id;
    }

    // 4. Verificar conflicto de nombre
    if (name) {
      const conflictingBudget = await this.prisma.budget.findFirst({
        where: {
          name,
          monthlySummaryId: targetMonthlySummaryId,
          userId,
          id: { not: id }, // Excluir el presupuesto actual
        },
      });

      if (conflictingBudget) {
        throw new ConflictException(
          'Ya existe otro presupuesto con este nombre para el período seleccionado.',
        );
      }
    }

    // 5. Actualizar el presupuesto
    return this.prisma.budget.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: string, userId: string) {
    // Verificar que el presupuesto existe y pertenece al usuario antes de borrar
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      throw new NotFoundException(
        'El presupuesto no existe o no pertenece al usuario.',
      );
    }

    return this.prisma.budget.delete({
      where: { id },
    });
  }
}

