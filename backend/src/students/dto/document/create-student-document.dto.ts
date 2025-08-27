import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsNumber, 
  IsUUID, 
  IsDateString,
  IsBoolean,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../entities/student-document.entity';

export class CreateStudentDocumentDto {
  @ApiProperty({ description: 'Document title', example: 'Birth Certificate' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Document type', enum: DocumentType, example: DocumentType.BIRTH_CERTIFICATE })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ description: 'Document file URL', example: 'https://example.com/documents/birth-certificate.pdf' })
  @IsString()
  fileUrl: string;

  @ApiProperty({ description: 'Document file name', example: 'birth-certificate.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: 'Document file size in bytes', example: 1024000 })
  @IsNumber()
  fileSize: number;

  @ApiProperty({ description: 'Document file MIME type', example: 'application/pdf' })
  @IsString()
  fileMimeType: string;

  @ApiProperty({ description: 'Document description', required: false, example: 'Official birth certificate issued by Douala Civil Registry' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Document issue date', required: false, example: '2020-01-15' })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiProperty({ description: 'Document expiry date', required: false, example: '2030-01-15' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({ description: 'Document reference number', required: false, example: 'BC-12345-2020' })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiProperty({ description: 'Document issuing authority', required: false, example: 'Douala Civil Registry' })
  @IsOptional()
  @IsString()
  issuingAuthority?: string;

  @ApiProperty({ description: 'Is document verified', required: false, default: false })
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

  @ApiProperty({ description: 'Student ID' })
  @IsUUID()
  studentId: string;
}

