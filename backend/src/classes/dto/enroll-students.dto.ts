import { 
  IsUUID,
  IsArray,
  ArrayMinSize
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollStudentsDto {
  @ApiProperty({ description: 'Student IDs to enroll', type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  studentIds: string[];
}

