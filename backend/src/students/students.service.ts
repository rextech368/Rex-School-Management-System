import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  findAll() {
    return this.studentsRepository.find({ relations: ['current_class', 'current_section', 'academic_year'] });
  }

  findOne(id: number) {
    return this.studentsRepository.findOne({
      where: { id },
      relations: ['current_class', 'current_section', 'academic_year'],
    });
  }

  async create(dto: CreateStudentDto) {
    const student = this.studentsRepository.create(dto);
    return await this.studentsRepository.save(student);
  }

  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.studentsRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    Object.assign(student, dto);
    return await this.studentsRepository.save(student);
  }

  async remove(id: number) {
    const student = await this.studentsRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    await this.studentsRepository.delete(id);
    return { deleted: true };
  }
}