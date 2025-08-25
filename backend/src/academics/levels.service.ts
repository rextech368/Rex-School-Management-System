import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from './entities/level.entity';
import { CreateLevelDto } from './dto/create-level.dto';

@Injectable()
export class LevelsService {
  constructor(@InjectRepository(Level) private repo: Repository<Level>) {}

  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  create(dto: CreateLevelDto) { return this.repo.save(dto); }
  async update(id: number, dto: Partial<CreateLevelDto>) {
    const level = await this.repo.findOne({ where: { id } });
    if (!level) throw new NotFoundException();
    Object.assign(level, dto);
    return this.repo.save(level);
  }
  async remove(id: number) {
    const level = await this.repo.findOne({ where: { id } });
    if (!level) throw new NotFoundException();
    await this.repo.remove(level);
    return { deleted: true };
  }
}