import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reportcard-email',
      redis: { host: 'localhost', port: 6379 },
    }),
  ],
  providers: [BulkEmailQueueProcessor, BulkEmailService],
  exports: [BullModule],
})
export class BulkEmailQueueModule {}