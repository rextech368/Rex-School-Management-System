import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { DocumentType } from '../../entities/student-document.entity';

class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  role: string;
}

export class StudentDocumentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: DocumentType })
  type: DocumentType;

  @ApiProperty()
  fileUrl: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  fileSize: number;

  @ApiProperty()
  fileMimeType: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  issueDate?: Date;

  @ApiProperty({ required: false })
  expiryDate?: Date;

  @ApiProperty({ required: false })
  referenceNumber?: string;

  @ApiProperty({ required: false })
  issuingAuthority?: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty({ required: false })
  verificationDate?: Date;

  @ApiProperty({ type: UserResponseDto, required: false })
  @Type(() => UserResponseDto)
  verifier?: UserResponseDto;

  @ApiProperty({ required: false })
  verificationNotes?: string;

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  verifiedBy?: string;

  @Exclude()
  deletedAt?: Date;

  @Exclude()
  createdBy?: string;

  @Exclude()
  updatedBy?: string;

  @Exclude()
  deletedBy?: string;
}

