import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Payment } from './entities/payment.entity';
import { Fee } from './entities/fee.entity';
import { InvoicesController } from './controllers/invoices.controller';
import { PaymentsController } from './controllers/payments.controller';
import { FeesController } from './controllers/fees.controller';
import { InvoicesService } from './services/invoices.service';
import { PaymentsService } from './services/payments.service';
import { FeesService } from './services/fees.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, Payment, Fee]),
  ],
  controllers: [
    InvoicesController,
    PaymentsController,
    FeesController,
  ],
  providers: [
    InvoicesService,
    PaymentsService,
    FeesService,
  ],
  exports: [
    InvoicesService,
    PaymentsService,
    FeesService,
  ],
})
export class FinanceModule {}

