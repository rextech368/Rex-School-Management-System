import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsUUID, 
  IsDateString,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../entities/student-document.entity';

export class UploadDocumentDto {
  @ApiProperty({ description: 'Document title', example: 'Birth Certificate' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Document type', enum: DocumentType, example: DocumentType.BIRTH_CERTIFICATE })
  @IsEnum(DocumentType)
  type: DocumentType;

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

  @ApiProperty({ description: 'Student ID' })
  @IsUUID()
  studentId: string;
}

