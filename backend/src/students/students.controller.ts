import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher', 'Finance Admin')
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @Roles('Admin', 'Teacher', 'Principal', 'Head Teacher', 'Finance Admin', 'Parent', 'Student')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Put(':id')
  @Roles('Admin')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}