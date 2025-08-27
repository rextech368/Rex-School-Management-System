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

export class UpdateStudentDocumentDto {
  @ApiProperty({ description: 'Document title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Document type (e.g., birth certificate, transcript)', required: false })
  @IsOptional()
  @IsString()
  documentType?: string;

  @ApiProperty({ description: 'Document file URL', required: false })
  @IsOptional()
  @IsUrl()
  fileUrl?: string;

  @ApiProperty({ description: 'Original filename', required: false })
  @IsOptional()
  @IsString()
  filename?: string;

  @ApiProperty({ description: 'File MIME type', required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ description: 'File size in bytes', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fileSize?: number;

  @ApiProperty({ description: 'Document expiry date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;

  @ApiProperty({ description: 'Document verification status', required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ description: 'Verification date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  verificationDate?: Date;

  @ApiProperty({ description: 'User ID who verified the document', required: false })
  @IsOptional()
  @IsUUID()
  verifiedBy?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

