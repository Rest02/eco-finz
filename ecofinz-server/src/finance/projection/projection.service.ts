import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectionDto } from './dto/create-projection.dto';
import { UpdateProjectionDto } from './dto/update-projection.dto';

@Injectable()
export class ProjectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createProjectionDto: CreateProjectionDto) {
    // Validate that the account belongs to the user
    const account = await this.prisma.account.findUnique({
      where: { id: createProjectionDto.accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('You do not own this account');
    }

    // Validate category if specified
    if (createProjectionDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: createProjectionDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      if (category.userId !== userId) {
        throw new ForbiddenException('You do not own this category');
      }
    }

    return this.prisma.projection.create({
      data: {
        ...createProjectionDto,
        userId,
      },
      include: {
        account: true,
        category: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.projection.findMany({
      where: { userId },
      include: {
        account: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const projection = await this.prisma.projection.findUnique({
      where: { id },
      include: {
        account: true,
        category: true,
      },
    });

    if (!projection) {
      throw new NotFoundException('Projection not found');
    }

    if (projection.userId !== userId) {
      throw new ForbiddenException('You do not own this projection');
    }

    return projection;
  }

  async update(userId: string, id: string, updateProjectionDto: UpdateProjectionDto) {
    // Check ownership
    await this.findOne(userId, id);

    // If accountId is being changed, validate new account ownership
    if (updateProjectionDto.accountId) {
      const account = await this.prisma.account.findUnique({
        where: { id: updateProjectionDto.accountId },
      });

      if (!account) {
        throw new NotFoundException('New account not found');
      }

      if (account.userId !== userId) {
        throw new ForbiddenException('You do not own the new account');
      }
    }

    // If categoryId is being changed, validate new category ownership
    if (updateProjectionDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProjectionDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('New category not found');
      }

      if (category.userId !== userId) {
        throw new ForbiddenException('You do not own the new category');
      }
    }

    return this.prisma.projection.update({
      where: { id },
      data: updateProjectionDto,
      include: {
        account: true,
        category: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    // Check ownership
    await this.findOne(userId, id);

    return this.prisma.projection.delete({
      where: { id },
    });
  }

  async syncOrphanedProjections(userId: string) {
    // 1. Find all real projections (non-simulation) for user
    const realProjections = await this.prisma.projection.findMany({
      where: {
        userId,
        isSimulation: false,
      },
    });

    let cleanedCount = 0;

    // 2. For each, check if a corresponding transaction exists near the time window
    for (const proj of realProjections) {
      const pCreatedAt = new Date(proj.createdAt);
      const winStart = new Date(pCreatedAt.getTime() - 60000);
      const winEnd = new Date(pCreatedAt.getTime() + 60000);

      const exists = await this.prisma.transaction.findFirst({
        where: {
          userId,
          accountId: proj.accountId,
          amount: proj.amount,
          createdAt: {
            gte: winStart,
            lte: winEnd
          }
        }
      });

      // If no corresponding transaction is found, it was deleted earlier and orphaned!
      if (!exists) {
        await this.prisma.projection.delete({
          where: { id: proj.id }
        });
        cleanedCount++;
      }
    }

    return {
      success: true,
      message: `Sincronización completada. Se eliminaron ${cleanedCount} proyecciones huérfanas.`,
      cleanedCount,
    };
  }
}
