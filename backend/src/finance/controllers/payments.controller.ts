import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PaymentsService } from '../services/payments.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { Payment } from '../entities/payment.entity';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  async findAll(@Query() query: any): Promise<{ data: Payment[]; total: number }> {
    return this.paymentsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePaymentDto: any): Promise<Payment> {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.paymentsService.remove(id);
  }

  @Get('student/:studentId')
  async findByStudent(@Param('studentId') studentId: string): Promise<Payment[]> {
    return this.paymentsService.findByStudent(studentId);
  }

  @Get('invoice/:invoiceId')
  async findByInvoice(@Param('invoiceId') invoiceId: string): Promise<Payment[]> {
    return this.paymentsService.findByInvoice(invoiceId);
  }

  @Get('method/:method')
  async findByMethod(@Param('method') method: string): Promise<Payment[]> {
    return this.paymentsService.findByMethod(method);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string): Promise<Payment[]> {
    return this.paymentsService.findByStatus(status);
  }
}

