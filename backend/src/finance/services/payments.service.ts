import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { Invoice, InvoiceStatus } from '../entities/invoice.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(createPaymentDto);
    
    // Set payment date if not provided
    if (!payment.paymentDate) {
      payment.paymentDate = new Date();
    }
    
    // Set status if not provided
    if (!payment.status) {
      payment.status = PaymentStatus.COMPLETED;
    }
    
    // Update invoice if provided
    if (payment.invoiceId) {
      await this.updateInvoiceAfterPayment(payment.invoiceId, payment.amount);
    }
    
    return this.paymentsRepository.save(payment);
  }

  private async updateInvoiceAfterPayment(invoiceId: string, paymentAmount: number): Promise<void> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id: invoiceId },
    });
    
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }
    
    // Update amount paid and balance
    invoice.amountPaid += paymentAmount;
    invoice.balance = invoice.amount - invoice.amountPaid;
    
    // Update status based on payment
    if (invoice.amountPaid >= invoice.amount) {
      invoice.status = InvoiceStatus.PAID;
    } else {
      invoice.status = InvoiceStatus.PARTIALLY_PAID;
    }
    
    await this.invoicesRepository.save(invoice);
  }

  async findAll(query: any): Promise<{ data: Payment[]; total: number }> {
    const take = query.limit || 10;
    const skip = query.page ? (query.page - 1) * take : 0;
    
    const [result, total] = await this.paymentsRepository.findAndCount({
      where: {
        ...(query.studentId && { studentId: query.studentId }),
        ...(query.invoiceId && { invoiceId: query.invoiceId }),
        ...(query.status && { status: query.status }),
        ...(query.paymentMethod && { paymentMethod: query.paymentMethod }),
        ...(query.organizationId && { organizationId: query.organizationId }),
      },
      order: {
        paymentDate: 'DESC',
      },
      take,
      skip,
      relations: ['student', 'invoice'],
    });
    
    return {
      data: result,
      total,
    };
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['student', 'invoice'],
    });
    
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    
    return payment;
  }

  async update(id: string, updatePaymentDto: any): Promise<Payment> {
    const payment = await this.findOne(id);
    const oldAmount = payment.amount;
    
    // Update payment properties
    Object.assign(payment, updatePaymentDto);
    
    // If amount changed and invoice exists, update invoice
    if (payment.amount !== oldAmount && payment.invoiceId) {
      const amountDifference = payment.amount - oldAmount;
      await this.updateInvoiceAfterPayment(payment.invoiceId, amountDifference);
    }
    
    return this.paymentsRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    
    // If payment is linked to an invoice, update invoice
    if (payment.invoiceId) {
      const invoice = await this.invoicesRepository.findOne({
        where: { id: payment.invoiceId },
      });
      
      if (invoice) {
        // Subtract payment amount from invoice
        invoice.amountPaid -= payment.amount;
        invoice.balance = invoice.amount - invoice.amountPaid;
        
        // Update status based on payment
        if (invoice.amountPaid <= 0) {
          invoice.status = InvoiceStatus.PENDING;
        } else if (invoice.amountPaid < invoice.amount) {
          invoice.status = InvoiceStatus.PARTIALLY_PAID;
        }
        
        await this.invoicesRepository.save(invoice);
      }
    }
    
    const result = await this.paymentsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
  }

  async findByStudent(studentId: string): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { studentId },
      relations: ['invoice'],
      order: {
        paymentDate: 'DESC',
      },
    });
  }

  async findByInvoice(invoiceId: string): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { invoiceId },
      order: {
        paymentDate: 'DESC',
      },
    });
  }

  async findByMethod(method: string): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { paymentMethod: method },
      relations: ['student', 'invoice'],
      order: {
        paymentDate: 'DESC',
      },
    });
  }

  async findByStatus(status: string): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { status: status as PaymentStatus },
      relations: ['student', 'invoice'],
      order: {
        paymentDate: 'DESC',
      },
    });
  }
}

