import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailTemplate } from './entities/email-template.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/report-cards/email-template')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailTemplateController {
  constructor(
    @InjectRepository(EmailTemplate) private templateRepo: Repository<EmailTemplate>
  ) {}

  @Get()
  @Roles('Admin', 'Principal', 'Head Teacher')
  async getTemplate(@Query('class_id') class_id: string, @Query('exam_id') exam_id: string) {
    return this.templateRepo.findOne({ where: { class_id, exam_id } });
  }

  @Post()
  @Roles('Admin', 'Principal', 'Head Teacher')
  async setTemplate(@Body() dto: { class_id: number, exam_id: number, subject: string, body: string }) {
    let template = await this.templateRepo.findOne({ where: { class_id: dto.class_id, exam_id: dto.exam_id } });
    if (!template) template = this.templateRepo.create(dto);
    else Object.assign(template, dto);
    return this.templateRepo.save(template);
  }
}