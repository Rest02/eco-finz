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
} from '@nestjs/common';
import { FixedExpenseService } from './fixed-expense.service';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { UpdateFixedExpenseDto } from './dto/update-fixed-expense.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('finance/fixed-expenses')
export class FixedExpenseController {
  constructor(private readonly fixedExpenseService: FixedExpenseService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateFixedExpenseDto) {
    return this.fixedExpenseService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.fixedExpenseService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.fixedExpenseService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateFixedExpenseDto,
  ) {
    return this.fixedExpenseService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.fixedExpenseService.remove(req.user.id, id);
  }
}
