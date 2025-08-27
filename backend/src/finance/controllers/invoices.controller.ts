import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { InvoicesService } from '../services/invoices.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { Invoice } from '../entities/invoice.entity';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  async findAll(@Query() query: any): Promise<{ data: Invoice[]; total: number }> {
    return this.invoicesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Invoice> {
    return this.invoicesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateInvoiceDto: any): Promise<Invoice> {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.invoicesService.remove(id);
  }

  @Get('student/:studentId')
  async findByStudent(@Param('studentId') studentId: string): Promise<Invoice[]> {
    return this.invoicesService.findByStudent(studentId);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string): Promise<Invoice[]> {
    return this.invoicesService.findByStatus(status);
  }

  @Get('overdue')
  async findOverdue(): Promise<Invoice[]> {
    return this.invoicesService.findOverdue();
  }
}

