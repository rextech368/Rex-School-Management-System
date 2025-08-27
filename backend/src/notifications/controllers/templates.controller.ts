import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplate } from '../entities/notification-template.entity';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { UpdateTemplateDto } from '../dto/update-template.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { NotificationType } from '../enums/notification-type.enum';

@ApiTags('notification-templates')
@Controller('notification-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TemplatesController {
  constructor(
    @InjectRepository(NotificationTemplate)
    private templateRepository: Repository<NotificationTemplate>,
  ) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new notification template' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The template has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(@Body() createTemplateDto: CreateTemplateDto): Promise<NotificationTemplate> {
    const template = this.templateRepository.create(createTemplateDto);
    return this.templateRepository.save(template);
  }

  @Get()
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Get all notification templates' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by notification type', enum: NotificationType })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all notification templates.',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findAll(
    @Query('type') type?: NotificationType,
    @Query('isActive') isActive?: boolean,
  ): Promise<NotificationTemplate[]> {
    const where: any = {};
    
    if (type) {
      where.type = type;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    
    return this.templateRepository.find({
      where,
      order: {
        name: 'ASC',
      },
    });
  }

  @Get(':id')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Get a notification template by ID' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the notification template.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findOne(@Param('id') id: string): Promise<NotificationTemplate> {
    return this.templateRepository.findOneBy({ id });
  }

  @Get('type/:type')
  @Roles('admin', 'registrar')
  @ApiOperation({ summary: 'Get a notification template by type' })
  @ApiParam({ name: 'type', description: 'Template type', enum: NotificationType })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the notification template.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findByType(@Param('type') type: NotificationType): Promise<NotificationTemplate> {
    return this.templateRepository.findOneBy({ type });
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a notification template' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The template has been successfully updated.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<NotificationTemplate> {
    await this.templateRepository.update(id, updateTemplateDto);
    return this.templateRepository.findOneBy({ id });
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a notification template' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The template has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Template not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.templateRepository.delete(id);
  }
}

