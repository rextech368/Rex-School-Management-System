import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateParentDto } from './create-parent.dto';
import { IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateParentDto extends PartialType(
  OmitType(CreateParentDto, ['studentIds'] as const),
) {
  @ApiProperty({ 
    description: 'Student IDs to associate with parent', 
    type: [String], 
    required: false,
    example: ['uuid1', 'uuid2']
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  studentIds?: string[];
}

