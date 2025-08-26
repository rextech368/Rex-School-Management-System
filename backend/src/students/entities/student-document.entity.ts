import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/base.entity';
import { Student } from './student.entity';

export enum DocumentType {
  BIRTH_CERTIFICATE = 'birth_certificate',
  TRANSFER_CERTIFICATE = 'transfer_certificate',
  MEDICAL_RECORD = 'medical_record',
  REPORT_CARD = 'report_card',
  ID_CARD = 'id_card',
  PASSPORT = 'passport',
  VISA = 'visa',
  RESIDENCE_PERMIT = 'residence_permit',
  VACCINATION_RECORD = 'vaccination_record',
  SCHOLARSHIP_DOCUMENT = 'scholarship_document',
  SPECIAL_NEEDS_DOCUMENT = 'special_needs_document',
  PARENT_ID = 'parent_id',
  GUARDIAN_AUTHORIZATION = 'guardian_authorization',
  FINANCIAL_DOCUMENT = 'financial_document',
  OTHER = 'other',
}

@Entity('student_documents')
export class StudentDocument extends BaseEntity {
  @ApiProperty({ description: 'Document title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Document type', enum: DocumentType })
  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.OTHER,
  })
  type: DocumentType;

  @ApiProperty({ description: 'Document file URL' })
  @Column()
  fileUrl: string;

  @ApiProperty({ description: 'Document file name' })
  @Column()
  fileName: string;

  @ApiProperty({ description: 'Document file size in bytes' })
  @Column()
  fileSize: number;

  @ApiProperty({ description: 'Document file MIME type' })
  @Column()
  fileMimeType: string;

  @ApiProperty({ description: 'Document description', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Document issue date', required: false })
  @Column({ type: 'date', nullable: true })
  issueDate?: Date;

  @ApiProperty({ description: 'Document expiry date', required: false })
  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @ApiProperty({ description: 'Document reference number', required: false })
  @Column({ nullable: true })
  referenceNumber?: string;

  @ApiProperty({ description: 'Document issuing authority', required: false })
  @Column({ nullable: true })
  issuingAuthority?: string;

  @ApiProperty({ description: 'Is document verified' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Verification date', required: false })
  @Column({ type: 'date', nullable: true })
  verificationDate?: Date;

  @ApiProperty({ description: 'Verified by user ID', required: false })
  @Column({ type: 'uuid', nullable: true })
  verifiedBy?: string;

  @ApiProperty({ description: 'Verification notes', required: false })
  @Column({ type: 'text', nullable: true })
  verificationNotes?: string;

  @ApiProperty({ description: 'Student ID' })
  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;
}

