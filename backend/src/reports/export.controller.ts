import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ResultsService } from '../results/results.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/report-cards/export')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExportController {
  constructor(private resultsService: ResultsService) {}

  @Get('analytics.csv')
  @Roles('Admin', 'Principal', 'Head Teacher')
  async exportAnalyticsCSV(@Query('class_id') classId: string, @Query('exam_id') examId: string, @Res() res: Response) {
    const analytics = await this.resultsService.getClassExamAnalytics(+classId, +examId);
    // Compose CSV: header row and data rows
    let csvRows = [
      'Metric,Value',
      `Average,${analytics.classAverage}`,
      `Pass Rate,${analytics.passRate}`,
    ];
    analytics.subjectStats.forEach((s: any) => {
      csvRows.push(`Subject Average (${s.subject}),${s.average}`);
    });
    analytics.topPerformers.forEach((s: any, i: number) => {
      csvRows.push(`Top Performer ${i+1},${s.name} (${s.total})`);
    });
    analytics.bottomPerformers.forEach((s: any, i: number) => {
      csvRows.push(`Bottom Performer ${i+1},${s.name} (${s.total})`);
    });
    // Add more rows as needed

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="analytics_class${classId}_exam${examId}.csv"`);
    res.send(csvRows.join('\n'));
  }
}