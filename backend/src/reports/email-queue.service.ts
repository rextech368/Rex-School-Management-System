import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailQueueService {
  constructor(private emailQueue: Queue) {}

  async queueStudentEmail(studentId: number, examId: number, classId: number, logId: number) {
    await this.emailQueue.add('sendStudentReportCard', {
      studentId, examId, classId, logId
    });
  }
}