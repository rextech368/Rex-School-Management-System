import { Response } from 'express';

@Get('class/:classId/exam/:examId/export')
@Roles('Admin', 'Teacher', 'Principal', 'Head Teacher')
async exportClassExamResults(@Param('classId') classId: string, @Param('examId') examId: string, @Res() res: Response) {
  const results = await this.service.getClassExamResults(+classId, +examId);
  // Convert to CSV or PDF here, e.g. using json2csv or pdfkit
  const csv = 'Student,Subject,Score\n' +
    results.map(r => `${r.student.first_name} ${r.student.last_name},${r.subject.name},${r.score}`).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="results.csv"');
  res.send(csv);
}