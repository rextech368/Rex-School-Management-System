import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';

@Injectable()
export class ExamsService {
  constructor(@InjectRepository(Exam) private repo: Repository<Exam>) {}

  findAll() { return this.repo.find({ relations: ['academic_year', 'term'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id }, relations: ['academic_year', 'term'] }); }
  create(dto: CreateExamDto) { return this.repo.save(dto); }
}