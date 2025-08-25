import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';

@Injectable()
export class ClassesService {
  constructor(@InjectRepository(Class) private repo: Repository<Class>) {}

  findAll() { return this.repo.find({ relations: ['level'] }); }
  findOne(id: number) { return this.repo.findOne({ where: { id }, relations: ['level'] }); }
  create(dto: CreateClassDto) { return this.repo.save(dto); }
  async update(id: number, dto: Partial<CreateClassDto>) {
    const klass = await this.repo.findOne({ where: { id } });
    if (!klass) throw new NotFoundException();
    Object.assign(klass, dto);
    return this.repo.save(klass);
  }
  async remove(id: number) {
    const klass = await this.repo.findOne({ where: { id } });
    if (!klass) throw new NotFoundException();
    await this.repo.remove(klass);
    return { deleted: true };
  }
}