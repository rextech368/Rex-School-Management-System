import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ResultsService } from '../results/results.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/report-cards/email-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailDashboardController {
  constructor(private resultsService: ResultsService) {}

  @Get('advanced-analytics')
  @Roles('Admin', 'Principal', 'Head Teacher')
  async getAdvancedAnalytics(@Query('class_id') classId: string, @Query('exam_id') examId: string) {
    // Example: get averages, pass rates, top/bottom students, subject stats, trends
    const classResults = await this.resultsService.getClassExamResults(+classId, +examId);
    const analytics = await this.resultsService.getClassExamAnalytics(+classId, +examId);

    // Compute trend (compare to previous exam if applicable)
    // ... fetch previous exam, calculate deltas, etc.

    return {
      average: analytics.classAverage,
      passRate: analytics.passRate,
      topPerformers: analytics.topPerformers,
      bottomPerformers: analytics.bottomPerformers,
      subjectStats: analytics.subjectStats,
      // trendDelta: ...,
    };
  }
}