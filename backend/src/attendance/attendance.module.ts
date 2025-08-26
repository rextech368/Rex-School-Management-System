import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceRecord } from './entities/attendance-record.entity';
import { AttendanceSession } from './entities/attendance-session.entity';
import { StudentsModule } from '../students/students.module';
import { ClassesModule } from '../classes/classes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendanceRecord, AttendanceSession]),
    StudentsModule,
    ClassesModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}

