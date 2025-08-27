import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FeesService } from '../services/fees.service';
import { CreateFeeDto } from '../dto/create-fee.dto';
import { Fee } from '../entities/fee.entity';

@Controller('fees')
@UseGuards(JwtAuthGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post()
  async create(@Body() createFeeDto: CreateFeeDto): Promise<Fee> {
    return this.feesService.create(createFeeDto);
  }

  @Get()
  async findAll(@Query() query: any): Promise<{ data: Fee[]; total: number }> {
    return this.feesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Fee> {
    return this.feesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateFeeDto: any): Promise<Fee> {
    return this.feesService.update(id, updateFeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.feesService.remove(id);
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string): Promise<Fee[]> {
    return this.feesService.findByType(type);
  }

  @Get('academic-year/:academicYear')
  async findByAcademicYear(@Param('academicYear') academicYear: string): Promise<Fee[]> {
    return this.feesService.findByAcademicYear(academicYear);
  }

  @Get('term/:term')
  async findByTerm(@Param('term') term: string): Promise<Fee[]> {
    return this.feesService.findByTerm(term);
  }

  @Get('grade/:gradeLevel')
  async findByGradeLevel(@Param('gradeLevel') gradeLevel: string): Promise<Fee[]> {
    return this.feesService.findByGradeLevel(gradeLevel);
  }
}

