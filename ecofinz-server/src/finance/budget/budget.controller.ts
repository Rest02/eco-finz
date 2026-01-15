import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FindAllBudgetsDto } from './dto/find-all-budgets.dto';

@UseGuards(JwtAuthGuard)
@Controller('finance/budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  create(@Request() req, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetService.create(createBudgetDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query() query: FindAllBudgetsDto) {
    return this.budgetService.findAll(req.user.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.budgetService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetService.update(id, req.user.id, updateBudgetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.budgetService.remove(id, req.user.id);
  }
}

