import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { StudentDocument } from '../entities/student-document.entity';
import { Student } from '../entities/student.entity';
import { CreateStudentDocumentDto } from '../dto/document/create-student-document.dto';
import { UpdateStudentDocumentDto } from '../dto/document/update-student-document.dto';
import { StudentDocumentFilterDto } from '../dto/document/student-document-filter.dto';

@Injectable()
export class StudentDocumentsService {
  constructor(
    @InjectRepository(StudentDocument)
    private documentsRepository: Repository<StudentDocument>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createDocumentDto: CreateStudentDocumentDto, userId?: string): Promise<StudentDocument> {
    // Check if student exists
    const student = await this.studentsRepository.findOneBy({ id: createDocumentDto.studentId });
    if (!student) {
      throw new NotFoundException(`Student with ID ${createDocumentDto.studentId} not found`);
    }

    // Create new document
    const document = this.documentsRepository.create({
      ...createDocumentDto,
      createdBy: userId,
      // Convert date strings to Date objects
      issueDate: createDocumentDto.issueDate ? new Date(createDocumentDto.issueDate) : undefined,
      expiryDate: createDocumentDto.expiryDate ? new Date(createDocumentDto.expiryDate) : undefined,
      verificationDate: createDocumentDto.verificationDate ? new Date(createDocumentDto.verificationDate) : undefined,
    });

    return this.documentsRepository.save(document);
  }

  async findAll(filterDto: StudentDocumentFilterDto): Promise<[StudentDocument[], number]> {
    const { 
      title, 
      type, 
      studentId, 
      isVerified, 
      referenceNumber,
      issuingAuthority,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filterDto;

    const query = this.documentsRepository.createQueryBuilder('document');

    // Apply filters
    if (title) {
      query.andWhere('document.title LIKE :title', { title: `%${title}%` });
    }

    if (type) {
      query.andWhere('document.type = :type', { type });
    }

    if (studentId) {
      query.andWhere('document.studentId = :studentId', { studentId });
    }

    if (isVerified !== undefined) {
      query.andWhere('document.isVerified = :isVerified', { isVerified });
    }

    if (referenceNumber) {
      query.andWhere('document.referenceNumber LIKE :referenceNumber', { referenceNumber: `%${referenceNumber}%` });
    }

    if (issuingAuthority) {
      query.andWhere('document.issuingAuthority LIKE :issuingAuthority', { issuingAuthority: `%${issuingAuthority}%` });
    }

    // Add relations
    query.leftJoinAndSelect('document.student', 'student');

    // Add pagination
    query.skip((page - 1) * limit)
      .take(limit)
      .orderBy(`document.${sortBy}`, sortOrder);

    // Execute query
    const [documents, total] = await query.getManyAndCount();
    return [documents, total];
  }

  async findOne(id: string): Promise<StudentDocument> {
    const document = await this.documentsRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async findByStudent(studentId: string): Promise<StudentDocument[]> {
    return this.documentsRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateDocumentDto: UpdateStudentDocumentDto, userId?: string): Promise<StudentDocument> {
    const document = await this.findOne(id);

    // Update document
    Object.assign(document, {
      ...updateDocumentDto,
      updatedBy: userId,
      // Convert date strings to Date objects
      issueDate: updateDocumentDto.issueDate ? new Date(updateDocumentDto.issueDate) : document.issueDate,
      expiryDate: updateDocumentDto.expiryDate ? new Date(updateDocumentDto.expiryDate) : document.expiryDate,
      verificationDate: updateDocumentDto.verificationDate ? new Date(updateDocumentDto.verificationDate) : document.verificationDate,
    });

    return this.documentsRepository.save(document);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const document = await this.findOne(id);

    // Soft delete
    document.deletedBy = userId;
    await this.documentsRepository.save(document);
    await this.documentsRepository.softDelete(id);
  }

  async verifyDocument(id: string, verifiedBy: string, verificationNotes?: string): Promise<StudentDocument> {
    const document = await this.findOne(id);

    document.isVerified = true;
    document.verificationDate = new Date();
    document.verifiedBy = verifiedBy;
    document.verificationNotes = verificationNotes;
    document.updatedBy = verifiedBy;

    return this.documentsRepository.save(document);
  }

  async bulkVerify(ids: string[], verifiedBy: string, verificationNotes?: string): Promise<void> {
    await this.documentsRepository.update(
      { id: In(ids) },
      { 
        isVerified: true,
        verificationDate: new Date(),
        verifiedBy,
        verificationNotes,
        updatedBy: verifiedBy
      }
    );
  }

  async bulkDelete(ids: string[], userId?: string): Promise<void> {
    // Update deletedBy for all documents
    await this.documentsRepository.update(
      { id: In(ids) },
      { deletedBy: userId }
    );

    // Soft delete all documents
    await this.documentsRepository.softDelete(ids);
  }

  async countDocuments(filters?: any): Promise<number> {
    return this.documentsRepository.count({
      where: filters,
    });
  }
}

