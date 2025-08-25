import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mark } from './entities/mark.entity';
import { CreateMarkDto } from './dto/create-mark.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MarksService {
  constructor(@InjectRepository(Mark) private repo: Repository<Mark>) {}

  findByExam(examId: number) {
    return this.repo.find({ where: { exam: { id: examId } }, relations: ['student', 'subject', 'entered_by'] });
  }

  async create(dto: CreateMarkDto, teacher: User) {
    const mark = this.repo.create({ ...dto, entered_by: teacher });
    return this.repo.save(mark);
  }

  async update(id: number, score: number, teacher: User) {
    const mark = await this.repo.findOne({ where: { id } });
    if (!mark) throw new NotFoundException();
    mark.score = score;
    mark.entered_by = teacher;
    return this.repo.save(mark);
  }
}