import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from '../entities/invoice.entity';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = this.invoicesRepository.create(createInvoiceDto);
    
    // Calculate balance if not provided
    if (!createInvoiceDto.balance) {
      invoice.balance = invoice.amount - (invoice.amountPaid || 0);
    }
    
    // Set status based on payment status if not provided
    if (!createInvoiceDto.status) {
      if (invoice.amountPaid === 0) {
        invoice.status = InvoiceStatus.PENDING;
      } else if (invoice.amountPaid < invoice.amount) {
        invoice.status = InvoiceStatus.PARTIALLY_PAID;
      } else {
        invoice.status = InvoiceStatus.PAID;
      }
    }
    
    return this.invoicesRepository.save(invoice);
  }

  async findAll(query: any): Promise<{ data: Invoice[]; total: number }> {
    const take = query.limit || 10;
    const skip = query.page ? (query.page - 1) * take : 0;
    
    const [result, total] = await this.invoicesRepository.findAndCount({
      where: {
        ...(query.studentId && { studentId: query.studentId }),
        ...(query.status && { status: query.status }),
        ...(query.type && { type: query.type }),
        ...(query.academicYear && { academicYear: query.academicYear }),
        ...(query.term && { term: query.term }),
        ...(query.organizationId && { organizationId: query.organizationId }),
      },
      order: {
        createdAt: 'DESC',
      },
      take,
      skip,
      relations: ['student', 'payments'],
    });
    
    return {
      data: result,
      total,
    };
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id },
      relations: ['student', 'payments'],
    });
    
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    
    return invoice;
  }

  async update(id: string, updateInvoiceDto: any): Promise<Invoice> {
    const invoice = await this.findOne(id);
    
    // Update invoice properties
    Object.assign(invoice, updateInvoiceDto);
    
    // Recalculate balance
    invoice.balance = invoice.amount - invoice.amountPaid;
    
    // Update status based on payment status
    if (invoice.amountPaid === 0) {
      invoice.status = InvoiceStatus.PENDING;
    } else if (invoice.amountPaid < invoice.amount) {
      invoice.status = InvoiceStatus.PARTIALLY_PAID;
    } else {
      invoice.status = InvoiceStatus.PAID;
    }
    
    // Check if invoice is overdue
    const currentDate = new Date();
    if (invoice.dueDate < currentDate && invoice.status !== InvoiceStatus.PAID) {
      invoice.status = InvoiceStatus.OVERDUE;
    }
    
    return this.invoicesRepository.save(invoice);
  }

  async remove(id: string): Promise<void> {
    const result = await this.invoicesRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
  }

  async findByStudent(studentId: string): Promise<Invoice[]> {
    return this.invoicesRepository.find({
      where: { studentId },
      relations: ['payments'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByStatus(status: string): Promise<Invoice[]> {
    return this.invoicesRepository.find({
      where: { status: status as InvoiceStatus },
      relations: ['student', 'payments'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOverdue(): Promise<Invoice[]> {
    const currentDate = new Date();
    
    return this.invoicesRepository.find({
      where: {
        dueDate: LessThan(currentDate),
        status: InvoiceStatus.PENDING,
      },
      relations: ['student', 'payments'],
      order: {
        dueDate: 'ASC',
      },
    });
  }
}

