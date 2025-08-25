import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Term } from './entities/term.entity';
import { CreateTermDto } from './dto/create-term.dto';

@Injectable()
export class TermsService {
  constructor(@InjectRepository(Term) private repo: Repository<Term>) {}

  findAll() { return this.repo.find({ relations: ['academic_year'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id }, relations: ['academic_year'] }); }
  create(dto: CreateTermDto) { return this.repo.save(dto); }
  async update(id: number, dto: Partial<CreateTermDto>) {
    const term = await this.repo.findOne({ where: { id } });
    if (!term) throw new NotFoundException();
    Object.assign(term, dto);
    return this.repo.save(term);
  }
  async remove(id: number) {
    const term = await this.repo.findOne({ where: { id } });
    if (!term) throw new NotFoundException();
    await this.repo.remove(term);
    return { deleted: true };
  }
}