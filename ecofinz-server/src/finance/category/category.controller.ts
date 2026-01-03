import { Controller, Post, Body, UseGuards, Request, Get, Patch, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(JwtAuthGuard)
@Controller('finance/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
        const userId = req.user.id;
        return this.categoryService.create(createCategoryDto, userId);
    }

    @Get()
    findAll(@Request() req) {
        const userId = req.user.id;
        return this.categoryService.findAll(userId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Request() req) {
        const userId = req.user.id;
        return this.categoryService.update(id, updateCategoryDto, userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        const userId = req.user.id;
        return this.categoryService.remove(id, userId);
    }
}
