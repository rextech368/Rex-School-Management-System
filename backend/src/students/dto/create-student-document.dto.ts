import { 
  IsString, 
  IsNumber,
  IsDate,
  IsOptional,
  IsUUID,
  IsUrl,
  IsBoolean,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDocumentDto {
  @ApiProperty({ description: 'Student ID' })
  @IsUUID()
  studentId: string;

  @ApiProperty({ description: 'Document title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Document type (e.g., birth certificate, transcript)' })
  @IsString()
  documentType: string;

  @ApiProperty({ description: 'Document file URL' })
  @IsUrl()
  fileUrl: string;

  @ApiProperty({ description: 'Original filename' })
  @IsString()
  filename: string;

  @ApiProperty({ description: 'File MIME type' })
  @IsString()
  mimeType: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsNumber()
  @Min(0)
  fileSize: number;

  @ApiProperty({ description: 'Document expiry date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;

  @ApiProperty({ description: 'Document verification status', required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ description: 'User ID who verified the document', required: false })
  @IsOptional()
  @IsUUID()
  verifiedBy?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

