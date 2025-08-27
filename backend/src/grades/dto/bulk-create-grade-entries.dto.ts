import { 
  IsArray, 
  IsUUID, 
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateGradeEntryDto } from './create-grade-entry.dto';

export class BulkCreateGradeEntriesDto {
  @ApiProperty({ description: 'Grade item ID' })
  @IsUUID()
  gradeItemId: string;

  @ApiProperty({ description: 'List of grade entries', type: [CreateGradeEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGradeEntryDto)
  entries: CreateGradeEntryDto[];
}

