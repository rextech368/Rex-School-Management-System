import { Injectable } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { ReportCardService } from './report-card.service';
import * as JSZip from 'jszip';

@Injectable()
export class BulkReportCardService {
  constructor(
    private studentsService: StudentsService,
    private reportCardService: ReportCardService
  ) {}

  // Generate a zip containing all report cards for a class in an exam
  async generateBulkReportCards(classId: number, examId: number): Promise<Buffer> {
    const students = await this.studentsService.findByClass(classId);
    const zip = new JSZip();

    for (const student of students) {
      const pdfBuffer = await this.reportCardService.generateStudentReportCard(student.id, examId);
      zip.file(`${student.first_name}_${student.last_name}_report.pdf`, pdfBuffer);
    }

    return zip.generateAsync({ type: 'nodebuffer' });
  }
}