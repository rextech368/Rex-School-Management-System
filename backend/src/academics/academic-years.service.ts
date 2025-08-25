import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicYear } from './entities/academic-year.entity';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';

@Injectable()
export class AcademicYearsService {
  constructor(
    @InjectRepository(AcademicYear)
    private repo: Repository<AcademicYear>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  create(dto: CreateAcademicYearDto) {
    const year = this.repo.create(dto);
    return this.repo.save(year);
  }

  async update(id: number, dto: UpdateAcademicYearDto) {
    const year = await this.repo.findOneBy({ id });
    if (!year) throw new NotFoundException();
    Object.assign(year, dto);
    return this.repo.save(year);
  }

  async remove(id: number) {
    const year = await this.repo.findOneBy({ id });
    if (!year) throw new NotFoundException();
    await this.repo.remove(year);
    return { deleted: true };
  }
}