import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { StudentsService } from '../students/students.service';
import { ResultsService } from '../results/results.service';
import { ExamsService } from '../exams/exams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/report-cards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailPreviewController {
  constructor(
    private mailer: MailerService,
    private studentsService: StudentsService,
    private examsService: ExamsService,
    private resultsService: ResultsService,
  ) {}

  @Get('student/:studentId/exam/:examId/email-preview')
  @Roles('Admin', 'Principal', 'Head Teacher')
  async emailPreview(@Param('studentId') studentId: string, @Param('examId') examId: string) {
    const student = await this.studentsService.findOne(+studentId);
    const exam = await this.examsService.findOne(+examId);
    const marks = await this.resultsService.getStudentExamResults(+studentId, +examId);
    // Compute average, position, etc. as in your main email logic

    // Render template and return HTML
    const html = await this.mailer.render('report-card', {
      schoolName: 'EDU-WISE Academy',
      parentName: student.guardian_name || 'Parent/Guardian',
      studentName: `${student.first_name} ${student.last_name}`,
      className: student.current_class?.name,
      examName: exam.name,
      subjects: marks.map(m => ({ name: m.subject.name, score: m.score })),
      average: computedAverage,
      position: computedPosition,
      totalStudents: totalStudents,
    });
    return { html };
  }
}