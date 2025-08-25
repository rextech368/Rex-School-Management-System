import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('api/v1/subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectsController {
  constructor(private readonly service: SubjectsService) {}

  @Get() @Roles('Admin', 'Principal', 'Head Teacher') findAll() { return this.service.findAll(); }
  @Get(':id') @Roles('Admin', 'Principal', 'Head Teacher') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
  @Post() @Roles('Admin') create(@Body() dto: CreateSubjectDto) { return this.service.create(dto); }
  @Put(':id') @Roles('Admin') update(@Param('id') id: string, @Body() dto: Partial<CreateSubjectDto>) { return this.service.update(+id, dto); }
  @Delete(':id') @Roles('Admin') remove(@Param('id') id: string) { return this.service.remove(+id); }
}