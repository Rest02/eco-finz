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
import { SavingsGoalService } from './savings-goal.service';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('finance/savings-goals')
export class SavingsGoalController {
  constructor(private readonly savingsGoalService: SavingsGoalService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateSavingsGoalDto) {
    return this.savingsGoalService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.savingsGoalService.findAll(req.user.id);
  }

  @Get('summary')
  getSummary(@Request() req) {
    return this.savingsGoalService.getSummary(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.savingsGoalService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateSavingsGoalDto,
  ) {
    return this.savingsGoalService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.savingsGoalService.remove(req.user.id, id);
  }
}
