import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('api/v1/academic-years')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicYearsController {
  constructor(private readonly service: AcademicYearsService) {}

  @Get()
  @Roles('Admin', 'Principal', 'Head Teacher')
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @Roles('Admin', 'Principal', 'Head Teacher')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateAcademicYearDto) { return this.service.create(dto); }

  @Put(':id')
  @Roles('Admin')
  update(@Param('id') id: string, @Body() dto: UpdateAcademicYearDto) { return this.service.update(+id, dto); }

  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}