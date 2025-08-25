import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mark } from '../exams/entities/mark.entity';
import { Student } from '../students/entities/student.entity';
import { Subject } from '../academics/entities/subject.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Mark) private marksRepo: Repository<Mark>,
    @InjectRepository(Student) private studentsRepo: Repository<Student>,
    @InjectRepository(Subject) private subjectsRepo: Repository<Subject>,
  ) {}

  async subjectPassRate(classId: number, examId: number, passMark = 50) {
    // For each subject, calculate pass rate in a class for an exam
    const allSubjects = await this.subjectsRepo.find();
    const rates = [];
    for (const subject of allSubjects) {
      const marks = await this.marksRepo
        .createQueryBuilder('mark')
        .leftJoin('mark.student', 'student')
        .leftJoin('student.current_class', 'class')
        .where('mark.examId = :examId', { examId })
        .andWhere('class.id = :classId', { classId })
        .andWhere('mark.subjectId = :subjectId', { subjectId: subject.id })
        .getMany();
      if (marks.length === 0) continue;
      const passed = marks.filter(m => Number(m.score) >= passMark).length;
      rates.push({
        subject: subject.name,
        passRate: (passed / marks.length * 100).toFixed(2),
        total: marks.length,
      });
    }
    return rates;
  }

  async topPerformers(classId: number, examId: number, limit = 10) {
    // Aggregate total score per student, rank, return top N
    const studentScores = await this.marksRepo
      .createQueryBuilder('mark')
      .leftJoin('mark.student', 'student')
      .leftJoin('student.current_class', 'class')
      .where('mark.examId = :examId', { examId })
      .andWhere('class.id = :classId', { classId })
      .select(['student.id as id', 'student.first_name as first_name', 'student.last_name as last_name', 'SUM(mark.score) as totalScore'])
      .groupBy('student.id')
      .orderBy('totalScore', 'DESC')
      .limit(limit)
      .getRawMany();
    return studentScores;
  }

  // Add more analytics as needed...
}