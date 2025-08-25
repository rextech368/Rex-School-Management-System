import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(private readonly service: ExamsService) {}

  @Get()
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher')
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateExamDto) { return this.service.create(dto); }
}