import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entities
import { AttendanceRecord } from './entities/attendance-record.entity';
import { Student } from '../students/entities/student.entity';

// Controllers
import { AttendanceController } from './controllers/attendance.controller';

// Services
import { AttendanceService } from './services/attendance.service';

// Import NotificationsModule for sending absence notifications
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendanceRecord, Student]),
    ConfigModule,
    NotificationsModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}

