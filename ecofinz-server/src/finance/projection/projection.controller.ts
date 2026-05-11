import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProjectionService } from './projection.service';
import { CreateProjectionDto } from './dto/create-projection.dto';
import { UpdateProjectionDto } from './dto/update-projection.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('finance/projection')
export class ProjectionController {
  constructor(private readonly projectionService: ProjectionService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() createProjectionDto: CreateProjectionDto) {
    const userId = req.user.id;
    return this.projectionService.create(userId, createProjectionDto);
  }

  @Post('sync')
  sync(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.projectionService.syncOrphanedProjections(userId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.projectionService.findAll(userId);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.id;
    return this.projectionService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateProjectionDto: UpdateProjectionDto,
  ) {
    const userId = req.user.id;
    return this.projectionService.update(userId, id, updateProjectionDto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.id;
    return this.projectionService.remove(userId, id);
  }
}
