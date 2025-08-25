import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mark } from '../exams/entities/mark.entity';
import { Student } from '../students/entities/student.entity';
import { Exam } from '../exams/entities/exam.entity';
import { Subject } from '../academics/entities/subject.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Mark) private marksRepo: Repository<Mark>,
    @InjectRepository(Student) private studentsRepo: Repository<Student>,
    @InjectRepository(Exam) private examsRepo: Repository<Exam>,
    @InjectRepository(Subject) private subjectsRepo: Repository<Subject>,
  ) {}

  // Get all marks for a student in an exam
  async getStudentExamResults(studentId: number, examId: number) {
    return this.marksRepo.find({
      where: { student: { id: studentId }, exam: { id: examId } },
      relations: ['subject']
    });
  }

  // Get all marks for a class in an exam
  async getClassExamResults(classId: number, examId: number) {
    return this.marksRepo
      .createQueryBuilder('mark')
      .leftJoinAndSelect('mark.student', 'student')
      .leftJoinAndSelect('mark.subject', 'subject')
      .leftJoin('student.current_class', 'class')
      .where('class.id = :classId', { classId })
      .andWhere('mark.examId = :examId', { examId })
      .getMany();
  }

  // Analytics: class/subject averages, ranking, etc.
  async getClassExamAnalytics(classId: number, examId: number) {
    // Compute averages, rankings, pass rates, etc.
    // Example: Class Average
    const results = await this.getClassExamResults(classId, examId);
    const students = new Set(results.map(m => m.student.id));
    const total = results.reduce((sum, m) => sum + Number(m.score), 0);
    const avg = students.size > 0 ? total / students.size : 0;
    return {
      classAverage: avg,
      totalStudents: students.size,
      results
    };
  }
}