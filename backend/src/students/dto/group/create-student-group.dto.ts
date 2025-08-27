import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsUUID, 
  IsArray,
  IsBoolean,
  IsNumber,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GroupType } from '../../entities/student-group.entity';

export class CreateStudentGroupDto {
  @ApiProperty({ description: 'Group name', example: 'Red House' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Group description', required: false, example: 'Sports and competition team' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Group type', enum: GroupType, example: GroupType.HOUSE })
  @IsEnum(GroupType)
  type: GroupType;

  @ApiProperty({ description: 'Academic year ID', required: false })
  @IsOptional()
  @IsUUID()
  academicYearId?: string;

  @ApiProperty({ description: 'Group code', required: false, example: 'RH-001' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Maximum capacity', required: false, example: 50 })
  @IsOptional()
  @IsNumber()
  maxCapacity?: number;

  @ApiProperty({ description: 'Group color code', required: false, example: '#FF0000' })
  @IsOptional()
  @IsString()
  colorCode?: string;

  @ApiProperty({ description: 'Group icon', required: false, example: 'fa-trophy' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Is active', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Parent group ID', required: false })
  @IsOptional()
  @IsUUID()
  parentGroupId?: string;

  @ApiProperty({ description: 'Group leader ID (teacher/staff)', required: false })
  @IsOptional()
  @IsUUID()
  leaderId?: string;

  @ApiProperty({ description: 'Group assistant leader ID', required: false })
  @IsOptional()
  @IsUUID()
  assistantLeaderId?: string;

  @ApiProperty({ description: 'Meeting schedule', required: false, example: 'Every Monday at 3:00 PM' })
  @IsOptional()
  @IsString()
  meetingSchedule?: string;

  @ApiProperty({ description: 'Meeting location', required: false, example: 'Main Hall' })
  @IsOptional()
  @IsString()
  meetingLocation?: string;

  @ApiProperty({ description: 'Student IDs to add to group', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  studentIds?: string[];
}

