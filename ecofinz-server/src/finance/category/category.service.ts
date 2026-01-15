import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    create(createCategoryDto: CreateCategoryDto, userId: string) {
        return this.prisma.category.create({
            data: {
                name: createCategoryDto.name,
                type: createCategoryDto.type,
                userId,
            },
        });
    }

    findAll(userId: string) {
        return this.prisma.category.findMany({
            where: { userId },
        });
    }

    update(id: string, updateCategoryDto: UpdateCategoryDto, userId: string) {
        return this.prisma.category.update({
            where: { id, userId },
            data: updateCategoryDto,
        });
    }

    remove(id: string, userId: string) {
        return this.prisma.category.delete({
            where: { id, userId },
        });
    }
}
