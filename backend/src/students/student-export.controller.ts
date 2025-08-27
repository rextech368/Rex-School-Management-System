import { 
  Controller, 
  Get, 
  Param, 
  Res, 
  UseGuards, 
  Query, 
  ParseIntPipe,
  StreamableFile,
  Header,
  BadRequestException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StudentsService } from './students.service';
import { StudentFilterDto } from './dto';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import { createReadStream } from 'fs';
import { join } from 'path';

@ApiTags('Student Exports')
@Controller('api/v1/students/export')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentExportController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('pdf')
  @Roles('Admin', 'Principal', 'Head Teacher', 'Finance Admin')
  @ApiOperation({ summary: 'Export students list as PDF' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a PDF file with student data'
  })
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="students.pdf"')
  async exportPDF(@Query() filterDto: StudentFilterDto, @Res({ passthrough: true }) res: Response) {
    // Remove pagination from filter to get all matching students
    const { page, limit, ...filters } = filterDto;
    const allFilters = { ...filters, limit: 1000 };
    
    const { data: students } = await this.studentsService.findAll(allFilters);
    
    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Add school logo
    try {
      const logoPath = join(process.cwd(), 'public', 'assets', 'logo.png');
      doc.image(logoPath, 50, 45, { width: 50 });
    } catch (error) {
      // Logo not found, continue without it
    }
    
    // Add title
    doc.fontSize(20).text('Student List', { align: 'center' });
    doc.moveDown();
    
    // Add date
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();
    
    // Add table headers
    const tableTop = 150;
    const tableLeft = 50;
    const colWidths = [100, 100, 80, 80, 100];
    
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Admission No.', tableLeft, tableTop);
    doc.text('Name', tableLeft + colWidths[0], tableTop);
    doc.text('Class', tableLeft + colWidths[0] + colWidths[1], tableTop);
    doc.text('Gender', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop);
    doc.text('Status', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableTop);
    
    // Add horizontal line
    doc.moveTo(tableLeft, tableTop + 20)
       .lineTo(tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], tableTop + 20)
       .stroke();
    
    // Add student data
    doc.font('Helvetica');
    let y = tableTop + 30;
    
    students.forEach((student, index) => {
      // Add page break if needed
      if (y > 700) {
        doc.addPage();
        y = 50;
        
        // Add headers on new page
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('Admission No.', tableLeft, y);
        doc.text('Name', tableLeft + colWidths[0], y);
        doc.text('Class', tableLeft + colWidths[0] + colWidths[1], y);
        doc.text('Gender', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], y);
        doc.text('Status', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y);
        
        // Add horizontal line
        doc.moveTo(tableLeft, y + 20)
           .lineTo(tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y + 20)
           .stroke();
        
        y += 30;
        doc.font('Helvetica');
      }
      
      // Add row background for alternate rows
      if (index % 2 === 0) {
        doc.rect(tableLeft, y - 10, colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], 20)
           .fill('#f5f5f5')
           .stroke();
      }
      
      doc.fillColor('black');
      doc.text(student.admissionNumber, tableLeft, y);
      doc.text(`${student.firstName} ${student.lastName}`, tableLeft + colWidths[0], y);
      doc.text(student.currentClass?.name || 'N/A', tableLeft + colWidths[0] + colWidths[1], y);
      doc.text(student.gender, tableLeft + colWidths[0] + colWidths[1] + colWidths[2], y);
      doc.text(student.status, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y);
      
      y += 20;
    });
    
    // Add footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      
      // Add page number
      doc.fontSize(8).text(
        `Page ${i + 1} of ${pageCount}`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );
      
      // Add footer text
      doc.fontSize(8).text(
        'Confidential - For authorized use only',
        50,
        doc.page.height - 30,
        { align: 'center' }
      );
    }
    
    // Finalize the PDF
    doc.end();
    
    return new StreamableFile(doc);
  }

  @Get('excel')
  @Roles('Admin', 'Principal', 'Head Teacher', 'Finance Admin')
  @ApiOperation({ summary: 'Export students list as Excel' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns an Excel file with student data'
  })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="students.xlsx"')
  async exportExcel(@Query() filterDto: StudentFilterDto, @Res({ passthrough: true }) res: Response) {
    // Remove pagination from filter to get all matching students
    const { page, limit, ...filters } = filterDto;
    const allFilters = { ...filters, limit: 1000 };
    
    const { data: students } = await this.studentsService.findAll(allFilters);
    
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');
    
    // Add headers
    worksheet.columns = [
      { header: 'Admission No.', key: 'admissionNumber', width: 15 },
      { header: 'First Name', key: 'firstName', width: 15 },
      { header: 'Last Name', key: 'lastName', width: 15 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Date of Birth', key: 'dateOfBirth', width: 15 },
      { header: 'Class', key: 'class', width: 15 },
      { header: 'Section', key: 'section', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phoneNumber', width: 15 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Admission Date', key: 'admissionDate', width: 15 },
    ];
    
    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Add student data
    students.forEach(student => {
      worksheet.addRow({
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        class: student.currentClass?.name || 'N/A',
        section: student.currentSection?.name || 'N/A',
        status: student.status,
        email: student.email || student.user?.email || 'N/A',
        phoneNumber: student.phoneNumber || student.user?.phoneNumber || 'N/A',
        address: student.address ? `${student.address}, ${student.city || ''}, ${student.state || ''}, ${student.country || ''}` : 'N/A',
        admissionDate: student.admissionDate,
      });
    });
    
    // Format date columns
    worksheet.getColumn('dateOfBirth').numFmt = 'yyyy-mm-dd';
    worksheet.getColumn('admissionDate').numFmt = 'yyyy-mm-dd';
    
    // Create a buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    return new StreamableFile(buffer);
  }

  @Get('csv')
  @Roles('Admin', 'Principal', 'Head Teacher', 'Finance Admin')
  @ApiOperation({ summary: 'Export students list as CSV' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a CSV file with student data'
  })
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="students.csv"')
  async exportCSV(@Query() filterDto: StudentFilterDto, @Res({ passthrough: true }) res: Response) {
    // Remove pagination from filter to get all matching students
    const { page, limit, ...filters } = filterDto;
    const allFilters = { ...filters, limit: 1000 };
    
    const { data: students } = await this.studentsService.findAll(allFilters);
    
    // Create a new Excel workbook (we'll use it to generate CSV)
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');
    
    // Add headers
    worksheet.columns = [
      { header: 'Admission No.', key: 'admissionNumber', width: 15 },
      { header: 'First Name', key: 'firstName', width: 15 },
      { header: 'Last Name', key: 'lastName', width: 15 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Date of Birth', key: 'dateOfBirth', width: 15 },
      { header: 'Class', key: 'class', width: 15 },
      { header: 'Section', key: 'section', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phoneNumber', width: 15 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Admission Date', key: 'admissionDate', width: 15 },
    ];
    
    // Add student data
    students.forEach(student => {
      worksheet.addRow({
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        class: student.currentClass?.name || 'N/A',
        section: student.currentSection?.name || 'N/A',
        status: student.status,
        email: student.email || student.user?.email || 'N/A',
        phoneNumber: student.phoneNumber || student.user?.phoneNumber || 'N/A',
        address: student.address ? `${student.address}, ${student.city || ''}, ${student.state || ''}, ${student.country || ''}` : 'N/A',
        admissionDate: student.admissionDate,
      });
    });
    
    // Create a buffer
    const buffer = await workbook.csv.writeBuffer();
    
    return new StreamableFile(buffer);
  }

  @Get(':studentId/:examId.pdf')
  @Roles('Admin', 'Principal', 'Head Teacher', 'Parent', 'Student')
  @ApiOperation({ summary: 'Export student exam results as PDF' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiParam({ name: 'examId', description: 'Exam ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a PDF file with student exam results'
  })
  @Header('Content-Type', 'application/pdf')
  async exportStudentResultsPDF(
    @Param('studentId', ParseIntPipe) studentId: string,
    @Param('examId', ParseIntPipe) examId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      // This is a placeholder for the actual report card generation
      // In a real implementation, you would call a service to generate the PDF
      
      // For now, we'll create a simple PDF
      const doc = new PDFDocument();
      
      doc.fontSize(25).text('Student Report Card', { align: 'center' });
      doc.moveDown();
      doc.fontSize(15).text(`Student ID: ${studentId}`);
      doc.fontSize(15).text(`Exam ID: ${examId}`);
      doc.moveDown();
      doc.fontSize(12).text('This is a placeholder for the actual report card.');
      
      // Set the filename
      res.setHeader('Content-Disposition', `attachment; filename="student_${studentId}_exam_${examId}.pdf"`);
      
      // Finalize the PDF
      doc.end();
      
      return new StreamableFile(doc);
    } catch (error) {
      throw new BadRequestException('Failed to generate report card');
    }
  }
}

