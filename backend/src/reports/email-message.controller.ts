import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailMessage } from './entities/email-message.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/report-cards/email-message')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailMessageController {
  constructor(
    @InjectRepository(EmailMessage) private messageRepo: Repository<EmailMessage>
  ) {}

  @Get(':studentId/:examId')
  @Roles('Admin', 'Principal', 'Head Teacher')
  async getMessage(@Param('studentId') studentId: string, @Param('examId') examId: string) {
    return this.messageRepo.findOne({ where: { student: { id: studentId }, exam_id: examId } });
  }

  @Post()
  @Roles('Admin', 'Principal', 'Head Teacher')
  async setMessage(@Body() dto: { student: number, class_id: number, exam_id: number, subject: string, body: string }) {
    let message = await this.messageRepo.findOne({ where: { student: { id: dto.student }, exam_id: dto.exam_id } });
    if (!message) message = this.messageRepo.create(dto);
    else Object.assign(message, dto);
    return this.messageRepo.save(message);
  }
}