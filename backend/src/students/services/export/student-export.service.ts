import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { Student } from '../../entities/student.entity';
import { ExportFormat } from '../../enums/export-format.enum';
import { ExportTemplate } from '../../entities/export-template.entity';

export interface ExportOptions {
  format: ExportFormat;
  templateId?: string;
  filters?: Record<string, any>;
  fields?: string[];
  includeHeader?: boolean;
  fileName?: string;
}

@Injectable()
export class StudentExportService {
  private readonly logger = new Logger(StudentExportService.name);
  private readonly exportDir: string;

  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(ExportTemplate)
    private templateRepository: Repository<ExportTemplate>,
    private configService: ConfigService,
  ) {
    this.exportDir = this.configService.get<string>('EXPORT_DIR') || 'exports';
    
    // Ensure export directory exists
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
    }
  }

  /**
   * Export students based on provided options
   * @param options Export options
   * @returns Path to the exported file
   */
  async exportStudents(options: ExportOptions): Promise<string> {
    try {
      const { format, templateId, filters, fields, includeHeader = true, fileName } = options;
      
      // Get template if provided
      let template: ExportTemplate = null;
      if (templateId) {
        template = await this.templateRepository.findOneBy({ id: templateId });
        if (!template) {
          throw new NotFoundException(`Export template with ID ${templateId} not found`);
        }
      }
      
      // Build query
      const queryBuilder = this.studentRepository.createQueryBuilder('student')
        .leftJoinAndSelect('student.program', 'program')
        .leftJoinAndSelect('student.documents', 'documents')
        .leftJoinAndSelect('student.guardians', 'guardians');
      
      // Apply filters if provided
      if (filters) {
        if (filters.name) {
          queryBuilder.andWhere('(student.firstName ILIKE :name OR student.lastName ILIKE :name)', 
            { name: `%${filters.name}%` });
        }
        
        if (filters.programId) {
          queryBuilder.andWhere('student.programId = :programId', { programId: filters.programId });
        }
        
        if (filters.status) {
          queryBuilder.andWhere('student.status = :status', { status: filters.status });
        }
        
        if (filters.enrollmentDateStart) {
          queryBuilder.andWhere('student.enrollmentDate >= :enrollmentDateStart', 
            { enrollmentDateStart: filters.enrollmentDateStart });
        }
        
        if (filters.enrollmentDateEnd) {
          queryBuilder.andWhere('student.enrollmentDate <= :enrollmentDateEnd', 
            { enrollmentDateEnd: filters.enrollmentDateEnd });
        }
      }
      
      // Get students
      const students = await queryBuilder.getMany();
      
      if (students.length === 0) {
        throw new NotFoundException('No students found matching the criteria');
      }
      
      // Determine fields to export
      const exportFields = fields || template?.fields || this.getDefaultFields();
      
      // Generate file name
      const outputFileName = fileName || 
        template?.name?.replace(/\s+/g, '_').toLowerCase() || 
        `students_export_${new Date().toISOString().slice(0, 10)}_${uuidv4().slice(0, 8)}`;
      
      // Export based on format
      switch (format) {
        case ExportFormat.CSV:
          return this.exportToCsv(students, exportFields, includeHeader, outputFileName);
        case ExportFormat.EXCEL:
          return this.exportToExcel(students, exportFields, includeHeader, outputFileName);
        case ExportFormat.PDF:
          return this.exportToPdf(students, exportFields, outputFileName, template);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      this.logger.error(`Failed to export students: ${error.message}`);
      throw error;
    }
  }

  /**
   * Export students to CSV
   * @param students Students to export
   * @param fields Fields to export
   * @param includeHeader Whether to include header row
   * @param fileName Output file name
   * @returns Path to the exported file
   */
  private async exportToCsv(
    students: Student[],
    fields: string[],
    includeHeader: boolean,
    fileName: string,
  ): Promise<string> {
    try {
      const outputPath = path.join(this.exportDir, `${fileName}.csv`);
      
      // Create CSV writer
      const csvWriter = createObjectCsvWriter({
        path: outputPath,
        header: fields.map(field => ({
          id: field,
          title: includeHeader ? this.formatFieldName(field) : field,
        })),
      });
      
      // Prepare data
      const records = students.map(student => {
        const record = {};
        fields.forEach(field => {
          record[field] = this.getFieldValue(student, field);
        });
        return record;
      });
      
      // Write CSV
      await csvWriter.writeRecords(records);
      
      this.logger.log(`Students exported to CSV: ${outputPath}`);
      return outputPath;
    } catch (error) {
      this.logger.error(`Failed to export students to CSV: ${error.message}`);
      throw error;
    }
  }

  /**
   * Export students to Excel
   * @param students Students to export
   * @param fields Fields to export
   * @param includeHeader Whether to include header row
   * @param fileName Output file name
   * @returns Path to the exported file
   */
  private async exportToExcel(
    students: Student[],
    fields: string[],
    includeHeader: boolean,
    fileName: string,
  ): Promise<string> {
    try {
      const outputPath = path.join(this.exportDir, `${fileName}.xlsx`);
      
      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students');
      
      // Add header row if needed
      if (includeHeader) {
        worksheet.addRow(fields.map(field => this.formatFieldName(field)));
      }
      
      // Add data rows
      students.forEach(student => {
        const rowData = fields.map(field => this.getFieldValue(student, field));
        worksheet.addRow(rowData);
      });
      
      // Apply some styling
      if (includeHeader) {
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' },
        };
      }
      
      // Auto-fit columns
      worksheet.columns.forEach(column => {
        column.width = 15;
      });
      
      // Write to file
      await workbook.xlsx.writeFile(outputPath);
      
      this.logger.log(`Students exported to Excel: ${outputPath}`);
      return outputPath;
    } catch (error) {
      this.logger.error(`Failed to export students to Excel: ${error.message}`);
      throw error;
    }
  }

  /**
   * Export students to PDF
   * @param students Students to export
   * @param fields Fields to export
   * @param fileName Output file name
   * @param template Export template
   * @returns Path to the exported file
   */
  private async exportToPdf(
    students: Student[],
    fields: string[],
    fileName: string,
    template?: ExportTemplate,
  ): Promise<string> {
    try {
      const outputPath = path.join(this.exportDir, `${fileName}.pdf`);
      
      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);
      
      // Add title
      doc.fontSize(20).text('Student Export', { align: 'center' });
      doc.moveDown();
      
      // Add date
      doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown();
      
      // Add template header if available
      if (template?.headerText) {
        doc.fontSize(12).text(template.headerText);
        doc.moveDown();
      }
      
      // Add table header
      const tableTop = 150;
      const columnSpacing = 25;
      let columnX = 50;
      
      // Calculate column widths
      const columnWidths = {};
      const pageWidth = doc.page.width - 100; // Margins on both sides
      const columnWidth = pageWidth / fields.length;
      
      fields.forEach(field => {
        columnWidths[field] = columnWidth;
      });
      
      // Draw header
      doc.fontSize(10).font('Helvetica-Bold');
      fields.forEach(field => {
        doc.text(this.formatFieldName(field), columnX, tableTop, {
          width: columnWidths[field],
          align: 'left',
        });
        columnX += columnWidths[field] + columnSpacing;
      });
      
      // Draw horizontal line
      doc.moveTo(50, tableTop + 20)
         .lineTo(doc.page.width - 50, tableTop + 20)
         .stroke();
      
      // Draw data rows
      let rowY = tableTop + 30;
      doc.font('Helvetica');
      
      students.forEach(student => {
        // Check if we need a new page
        if (rowY > doc.page.height - 50) {
          doc.addPage();
          rowY = 50;
        }
        
        columnX = 50;
        fields.forEach(field => {
          const value = this.getFieldValue(student, field);
          doc.text(value !== null && value !== undefined ? value.toString() : '', 
            columnX, rowY, {
              width: columnWidths[field],
              align: 'left',
            });
          columnX += columnWidths[field] + columnSpacing;
        });
        
        rowY += 20;
      });
      
      // Add template footer if available
      if (template?.footerText) {
        doc.moveDown(2);
        doc.fontSize(10).text(template.footerText, { align: 'center' });
      }
      
      // Finalize PDF
      doc.end();
      
      // Wait for the PDF to be written
      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          this.logger.log(`Students exported to PDF: ${outputPath}`);
          resolve(outputPath);
        });
        writeStream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`Failed to export students to PDF: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get default fields for export
   * @returns Array of default field names
   */
  private getDefaultFields(): string[] {
    return [
      'id',
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'dateOfBirth',
      'gender',
      'address',
      'enrollmentDate',
      'status',
      'program.name',
    ];
  }

  /**
   * Format field name for display
   * @param field Field name
   * @returns Formatted field name
   */
  private formatFieldName(field: string): string {
    // Handle nested fields
    if (field.includes('.')) {
      const parts = field.split('.');
      return this.formatFieldName(parts[parts.length - 1]);
    }
    
    // Convert camelCase to Title Case with spaces
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Get field value from student object
   * @param student Student object
   * @param field Field name
   * @returns Field value
   */
  private getFieldValue(student: any, field: string): any {
    // Handle nested fields
    if (field.includes('.')) {
      const parts = field.split('.');
      let value = student;
      
      for (const part of parts) {
        if (value === null || value === undefined) {
          return '';
        }
        value = value[part];
      }
      
      return value !== null && value !== undefined ? value : '';
    }
    
    // Handle regular fields
    return student[field] !== null && student[field] !== undefined ? student[field] : '';
  }

  /**
   * Delete an exported file
   * @param filePath Path to the file
   */
  async deleteExportedFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`Deleted exported file: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete exported file: ${error.message}`);
      throw error;
    }
  }
}

