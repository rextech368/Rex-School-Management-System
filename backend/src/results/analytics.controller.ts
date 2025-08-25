import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('class/:classId/exam/:examId/subject-pass-rates')
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher')
  getSubjectPassRates(@Param('classId') classId: string, @Param('examId') examId: string, @Query('passMark') passMark?: string) {
    return this.service.subjectPassRate(+classId, +examId, passMark ? Number(passMark) : 50);
  }

  @Get('class/:classId/exam/:examId/top-performers')
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher')
  getTopPerformers(@Param('classId') classId: string, @Param('examId') examId: string, @Query('limit') limit?: string) {
    return this.service.topPerformers(+classId, +examId, limit ? Number(limit) : 10);
  }
}