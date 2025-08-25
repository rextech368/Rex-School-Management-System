import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParentNotificationLog } from './entities/parent-notification-log.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('api/v1/parent-notification-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ParentNotificationLogController {
  constructor(
    @InjectRepository(ParentNotificationLog) private logRepo: Repository<ParentNotificationLog>
  ) {}

  @Get()
  @Roles('Admin', 'Parent')
  async list(@Query('parent_id') parent_id: string, @Query('student_id') student_id?: string) {
    return this.logRepo.find({
      where: { parent: { id: parent_id }, ...(student_id && { student: { id: student_id } }) },
      relations: ['student'],
      order: { created_at: 'DESC' }
    });
  }
}