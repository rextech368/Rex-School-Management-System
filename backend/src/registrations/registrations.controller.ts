import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationStatusDto } from './dto/update-registration-status.dto';

@Controller('api/v1/registrations')
export class RegistrationsController {
  constructor(private readonly service: RegistrationsService) {}

  @Post()
  create(@Body() dto: CreateRegistrationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateRegistrationStatusDto) {
    return this.service.updateStatus(+id, dto);
  }
}