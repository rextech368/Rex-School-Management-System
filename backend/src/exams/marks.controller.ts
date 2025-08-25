import { Controller, Get, Post, Body, Param, Put, UseGuards, Req } from '@nestjs/common';
import { MarksService } from './marks.service';
import { CreateMarkDto } from './dto/create-mark.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/marks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarksController {
  constructor(private readonly service: MarksService) {}

  @Get('exam/:examId')
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher')
  findByExam(@Param('examId') examId: string) {
    return this.service.findByExam(+examId);
  }

  @Post()
  @Roles('Teacher', 'Admin')
  create(@Body() dto: CreateMarkDto, @Req() req) {
    return this.service.create(dto, req.user);
  }

  @Put(':id')
  @Roles('Teacher', 'Admin')
  update(@Param('id') id: string, @Body('score') score: number, @Req() req) {
    return this.service.update(+id, score, req.user);
  }
}