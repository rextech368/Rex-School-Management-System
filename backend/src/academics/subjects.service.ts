import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(@InjectRepository(Subject) private repo: Repository<Subject>) {}

  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  create(dto: CreateSubjectDto) { return this.repo.save(dto); }
  async update(id: number, dto: Partial<CreateSubjectDto>) {
    const subject = await this.repo.findOne({ where: { id } });
    if (!subject) throw new NotFoundException();
    Object.assign(subject, dto);
    return this.repo.save(subject);
  }
  async remove(id: number) {
    const subject = await this.repo.findOne({ where: { id } });
    if (!subject) throw new NotFoundException();
    await this.repo.remove(subject);
    return { deleted: true };
  }
}