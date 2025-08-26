import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateStudentDocumentDto } from './create-student-document.dto';
import { IsOptional, IsBoolean, IsDateString, IsUUID, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentDocumentDto extends PartialType(
  OmitType(CreateStudentDocumentDto, ['studentId'] as const),
) {
  @ApiProperty({ description: 'Is document verified', required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ description: 'Verification date', required: false, example: '2023-09-01' })
  @IsOptional()
  @IsDateString()
  verificationDate?: string;

  @ApiProperty({ description: 'Verified by user ID', required: false })
  @IsOptional()
  @IsUUID()
  verifiedBy?: string;

  @ApiProperty({ description: 'Verification notes', required: false, example: 'Document verified against original' })
  @IsOptional()
  @IsString()
  verificationNotes?: string;
}

