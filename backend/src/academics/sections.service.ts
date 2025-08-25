import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';

@Injectable()
export class SectionsService {
  constructor(@InjectRepository(Section) private repo: Repository<Section>) {}

  findAll() { return this.repo.find({ relations: ['class'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id }, relations: ['class'] }); }
  create(dto: CreateSectionDto) { return this.repo.save(dto); }
  async update(id: number, dto: Partial<CreateSectionDto>) {
    const section = await this.repo.findOne({ where: { id } });
    if (!section) throw new NotFoundException();
    Object.assign(section, dto);
    return this.repo.save(section);
  }
  async remove(id: number) {
    const section = await this.repo.findOne({ where: { id } });
    if (!section) throw new NotFoundException();
    await this.repo.remove(section);
    return { deleted: true };
  }
}