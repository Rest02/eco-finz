import { Module } from '@nestjs/common';
import { ProjectionService } from './projection.service';
import { ProjectionController } from './projection.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectionController],
  providers: [ProjectionService],
  exports: [ProjectionService],
})
export class ProjectionModule {}
