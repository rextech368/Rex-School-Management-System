import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailDeliveryLog } from './entities/email-delivery-log.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/report-cards/email-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailLogController {
  constructor(
    @InjectRepository(EmailDeliveryLog) private emailLogRepo: Repository<EmailDeliveryLog>
  ) {}

  @Get()
  @Roles('Admin', 'Principal', 'Head Teacher')
  async getLogs(@Query('class_id') class_id: string, @Query('exam_id') exam_id: string) {
    return this.emailLogRepo.find({ where: { class_id, exam_id }, relations: ['student'] });
  }
}