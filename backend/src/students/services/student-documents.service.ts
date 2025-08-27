import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { StudentDocument } from '../entities/student-document.entity';
import { Student } from '../entities/student.entity';
import { CreateStudentDocumentDto } from '../dto/document/create-student-document.dto';
import { UpdateStudentDocumentDto } from '../dto/document/update-student-document.dto';
import { StudentDocumentFilterDto } from '../dto/document/student-document-filter.dto';
import { UploadDocumentDto } from '../dto/document/upload-document.dto';
import { FileUploadService, UploadedFileInfo } from '../../common/services/file-upload.service';

@Injectable()
export class StudentDocumentsService {
  constructor(
    @InjectRepository(StudentDocument)
    private documentsRepository: Repository<StudentDocument>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    private fileUploadService: FileUploadService,
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

  /**
   * Upload a document file and create a document record
   * @param file The file to upload
   * @param uploadDocumentDto Document metadata
   * @param userId User ID of the uploader
   * @returns The created document
   */
  async uploadDocument(
    file: Express.Multer.File,
    uploadDocumentDto: UploadDocumentDto,
    userId?: string,
  ): Promise<StudentDocument> {
    // Check if student exists
    const student = await this.studentsRepository.findOneBy({ id: uploadDocumentDto.studentId });
    if (!student) {
      throw new NotFoundException(`Student with ID ${uploadDocumentDto.studentId} not found`);
    }

    // Determine the subdirectory for the file
    const subDirectory = `students/${uploadDocumentDto.studentId}/documents`;

    // Upload the file
    const uploadedFile = await this.fileUploadService.uploadFile(file, {
      subDirectory,
      allowedMimeTypes: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    // Create document record
    const document = this.documentsRepository.create({
      title: uploadDocumentDto.title,
      type: uploadDocumentDto.type,
      description: uploadDocumentDto.description,
      fileUrl: uploadedFile.url,
      fileName: uploadedFile.fileName,
      fileSize: uploadedFile.size,
      fileMimeType: uploadedFile.mimeType,
      studentId: uploadDocumentDto.studentId,
      issueDate: uploadDocumentDto.issueDate ? new Date(uploadDocumentDto.issueDate) : undefined,
      expiryDate: uploadDocumentDto.expiryDate ? new Date(uploadDocumentDto.expiryDate) : undefined,
      referenceNumber: uploadDocumentDto.referenceNumber,
      issuingAuthority: uploadDocumentDto.issuingAuthority,
      createdBy: userId,
    });

    return this.documentsRepository.save(document);
  }

  /**
   * Upload multiple document files and create document records
   * @param files The files to upload
   * @param uploadDocumentDtos Document metadata for each file
   * @param userId User ID of the uploader
   * @returns The created documents
   */
  async uploadMultipleDocuments(
    files: Express.Multer.File[],
    uploadDocumentDtos: UploadDocumentDto[],
    userId?: string,
  ): Promise<StudentDocument[]> {
    if (files.length !== uploadDocumentDtos.length) {
      throw new BadRequestException('Number of files and document metadata must match');
    }

    const uploadPromises = files.map((file, index) => 
      this.uploadDocument(file, uploadDocumentDtos[index], userId)
    );

    return Promise.all(uploadPromises);
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

    // Delete the file if it exists
    try {
      const filePath = this.fileUploadService.getFilePath(
        document.fileName,
        `students/${document.studentId}/documents`
      );
      
      if (await this.fileUploadService.fileExists(filePath)) {
        await this.fileUploadService.deleteFile(filePath);
      }
    } catch (error) {
      // Log error but continue with document deletion
      console.error(`Failed to delete file for document ${id}:`, error);
    }

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
    // Get all documents to delete their files
    const documents = await this.documentsRepository.findBy({ id: In(ids) });

    // Delete files
    for (const document of documents) {
      try {
        const filePath = this.fileUploadService.getFilePath(
          document.fileName,
          `students/${document.studentId}/documents`
        );
        
        if (await this.fileUploadService.fileExists(filePath)) {
          await this.fileUploadService.deleteFile(filePath);
        }
      } catch (error) {
        // Log error but continue with document deletion
        console.error(`Failed to delete file for document ${document.id}:`, error);
      }
    }

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

  /**
   * Replace a document file
   * @param id Document ID
   * @param file New file
   * @param userId User ID
   * @returns Updated document
   */
  async replaceDocumentFile(
    id: string,
    file: Express.Multer.File,
    userId?: string,
  ): Promise<StudentDocument> {
    const document = await this.findOne(id);

    // Delete the old file if it exists
    try {
      const filePath = this.fileUploadService.getFilePath(
        document.fileName,
        `students/${document.studentId}/documents`
      );
      
      if (await this.fileUploadService.fileExists(filePath)) {
        await this.fileUploadService.deleteFile(filePath);
      }
    } catch (error) {
      // Log error but continue with file replacement
      console.error(`Failed to delete old file for document ${id}:`, error);
    }

    // Upload the new file
    const uploadedFile = await this.fileUploadService.uploadFile(file, {
      subDirectory: `students/${document.studentId}/documents`,
      allowedMimeTypes: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    // Update document
    document.fileUrl = uploadedFile.url;
    document.fileName = uploadedFile.fileName;
    document.fileSize = uploadedFile.size;
    document.fileMimeType = uploadedFile.mimeType;
    document.updatedBy = userId;

    return this.documentsRepository.save(document);
  }
}

