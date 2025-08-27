import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './services/users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto, UserFilterDto } from './dto';
import { UserStatus } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(@Body() createUserDto: CreateUserDto, @Request() req): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto, req.user.id);
    return this.mapToResponseDto(user);
  }

  @Get()
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Get all users with filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all users.',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findAll(@Query() filterDto: UserFilterDto): Promise<{ data: UserResponseDto[]; total: number }> {
    const [users, total] = await this.usersService.findAll(filterDto);
    return {
      data: users.map(user => this.mapToResponseDto(user)),
      total,
    };
  }

  @Get(':id')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the user.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return this.mapToResponseDto(user);
  }

  @Get('email/:email')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiParam({ name: 'email', description: 'User email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the user.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    const user = await this.usersService.findByEmail(email);
    return this.mapToResponseDto(user);
  }

  @Patch(':id')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully updated.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto, req.user.id);
    return this.mapToResponseDto(user);
  }

  @Delete(':id')
  @Roles('super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    await this.usersService.remove(id, req.user.id);
  }

  @Patch(':id/status')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Update user status' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(UserStatus),
          description: 'User status',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user status has been successfully updated.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: UserStatus,
    @Request() req,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.updateStatus(id, status, req.user.id);
    return this.mapToResponseDto(user);
  }

  @Post('bulk-delete')
  @Roles('super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete multiple users' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uuid',
          },
          description: 'Array of user IDs to delete',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The users have been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async bulkDelete(@Body('ids') ids: string[], @Request() req): Promise<void> {
    await this.usersService.bulkDelete(ids, req.user.id);
  }

  @Post('bulk-update-status')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Update status for multiple users' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uuid',
          },
          description: 'Array of user IDs to update',
        },
        status: {
          type: 'string',
          enum: Object.values(UserStatus),
          description: 'User status',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'The users status has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async bulkUpdateStatus(
    @Body('ids') ids: string[],
    @Body('status') status: UserStatus,
    @Request() req,
  ): Promise<{ success: boolean }> {
    await this.usersService.bulkUpdateStatus(ids, status, req.user.id);
    return { success: true };
  }

  @Get('statistics')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return user statistics.',
    schema: {
      type: 'object',
      properties: {
        totalUsers: { type: 'number' },
        byStatus: {
          type: 'object',
          properties: {
            activeUsers: { type: 'number' },
            pendingUsers: { type: 'number' },
            inactiveUsers: { type: 'number' },
            suspendedUsers: { type: 'number' },
          },
        },
        byRole: {
          type: 'object',
          properties: {
            adminUsers: { type: 'number' },
            teacherUsers: { type: 'number' },
            studentUsers: { type: 'number' },
            parentUsers: { type: 'number' },
            staffUsers: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getStatistics(): Promise<any> {
    return this.usersService.getUserStatistics();
  }

  // Helper method to map entity to DTO
  private mapToResponseDto(user: any): UserResponseDto {
    const responseDto = new UserResponseDto();
    Object.assign(responseDto, user);
    return responseDto;
  }
}

