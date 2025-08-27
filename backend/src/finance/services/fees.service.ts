import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fee, FeeType } from '../entities/fee.entity';
import { CreateFeeDto } from '../dto/create-fee.dto';

@Injectable()
export class FeesService {
  constructor(
    @InjectRepository(Fee)
    private feesRepository: Repository<Fee>,
  ) {}

  async create(createFeeDto: CreateFeeDto): Promise<Fee> {
    const fee = this.feesRepository.create(createFeeDto);
    return this.feesRepository.save(fee);
  }

  async findAll(query: any): Promise<{ data: Fee[]; total: number }> {
    const take = query.limit || 10;
    const skip = query.page ? (query.page - 1) * take : 0;
    
    const [result, total] = await this.feesRepository.findAndCount({
      where: {
        ...(query.type && { type: query.type }),
        ...(query.academicYear && { academicYear: query.academicYear }),
        ...(query.term && { term: query.term }),
        ...(query.gradeLevel && { gradeLevel: query.gradeLevel }),
        ...(query.isActive !== undefined && { isActive: query.isActive }),
        ...(query.organizationId && { organizationId: query.organizationId }),
      },
      order: {
        createdAt: 'DESC',
      },
      take,
      skip,
    });
    
    return {
      data: result,
      total,
    };
  }

  async findOne(id: string): Promise<Fee> {
    const fee = await this.feesRepository.findOne({
      where: { id },
    });
    
    if (!fee) {
      throw new NotFoundException(`Fee with ID ${id} not found`);
    }
    
    return fee;
  }

  async update(id: string, updateFeeDto: any): Promise<Fee> {
    const fee = await this.findOne(id);
    
    // Update fee properties
    Object.assign(fee, updateFeeDto);
    
    return this.feesRepository.save(fee);
  }

  async remove(id: string): Promise<void> {
    const result = await this.feesRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Fee with ID ${id} not found`);
    }
  }

  async findByType(type: string): Promise<Fee[]> {
    return this.feesRepository.find({
      where: { type: type as FeeType },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByAcademicYear(academicYear: string): Promise<Fee[]> {
    return this.feesRepository.find({
      where: { academicYear },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByTerm(term: string): Promise<Fee[]> {
    return this.feesRepository.find({
      where: { term },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByGradeLevel(gradeLevel: string): Promise<Fee[]> {
    return this.feesRepository.find({
      where: { gradeLevel },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}

