import { Controller, Get, Post, Body, Query, Param, Res, UseGuards } from '@nestjs/common';
import { ResultsService } from '../results/results.service';
import { ClassesService } from './classes.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/classes/export')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassExportController {
  constructor(
    private resultsService: ResultsService,
    private classesService: ClassesService,
  ) {}

  @Post(':classId/:examId/custom.csv')
  @Roles('Admin', 'Principal', 'Head Teacher')
  async exportCustomClassResultsCSV(
    @Param('classId') classId: string,
    @Param('examId') examId: string,
    @Body() body: { columns: string[] },
    @Res() res: Response,
  ) {
    const results = await this.resultsService.getClassExamResults(+classId, +examId);

    // Supported columns: 'Student Name', 'Total', 'Average', 'Position', 'Subject:Math:Score', 'Subject:English:Grade', etc.
    // Parse subjects from columns
    const subjectColumns = body.columns.filter(c => c.startsWith('Subject:'));
    const generalColumns = body.columns.filter(c => !c.startsWith('Subject:'));

    // Header
    let header = [...generalColumns, ...subjectColumns].join(',');

    let csvRows = [header];

    results.forEach((r: any) => {
      let row: string[] = [];
      generalColumns.forEach(col => {
        switch (col) {
          case 'Student Name':
            row.push(`${r.student.first_name} ${r.student.last_name}`); break;
          case 'Total': row.push(r.total ?? ''); break;
          case 'Average': row.push(r.average ?? ''); break;
          case 'Position': row.push(r.position ?? ''); break;
          default: row.push('');
        }
      });
      subjectColumns.forEach(col => {
        // Example: 'Subject:Math:Grade'
        const [_, subj, field] = col.split(':');
        const subject = r.subjects.find((s: any) => s.name === subj);
        switch (field) {
          case 'Score': row.push(subject?.score ?? ''); break;
          case 'Grade': row.push(subject?.grade ?? ''); break;
          case 'Remarks': row.push(subject?.remarks ?? ''); break;
          default: row.push('');
        }
      });
      csvRows.push(row.join(','));
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="class_${classId}_exam_${examId}_custom.csv"`);
    res.send(csvRows.join('\n'));
  }
}