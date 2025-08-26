import { 
  IsString, 
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDate,
  Matches
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from '../enums/day-of-week.enum';

export class UpdateClassScheduleDto {
  @ApiProperty({ description: 'Day of week', enum: DayOfWeek, required: false })
  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @ApiProperty({ description: 'Start time (HH:MM format)', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Start time must be in HH:MM format' })
  startTime?: string;

  @ApiProperty({ description: 'End time (HH:MM format)', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'End time must be in HH:MM format' })
  endTime?: string;

  @ApiProperty({ description: 'Room (overrides class room)', required: false })
  @IsOptional()
  @IsString()
  room?: string;

  @ApiProperty({ description: 'Building (overrides class building)', required: false })
  @IsOptional()
  @IsString()
  building?: string;

  @ApiProperty({ description: 'Whether this is a recurring schedule', required: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiProperty({ description: 'Specific date (for non-recurring schedules)', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  specificDate?: Date;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

