import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelperService } from './helper.service';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [HelperService, LoggerService],
  exports: [HelperService, LoggerService],
})
export class CommonModule {}

