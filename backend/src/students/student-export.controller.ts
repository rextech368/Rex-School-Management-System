@Get(':studentId/:examId.pdf')
@Roles('Admin', 'Principal', 'Head Teacher', 'Parent', 'Student')
async exportStudentResultsPDF(
  @Param('studentId') studentId: string,
  @Param('examId') examId: string,
  @Res() res: Response,
) {
  const pdfBuffer = await this.reportCardService.generateStudentReportCard(+studentId, +examId);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="student_${studentId}_exam_${examId}.pdf"`);
  res.send(pdfBuffer);
}