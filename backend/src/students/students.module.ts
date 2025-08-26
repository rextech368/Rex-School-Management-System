import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StudentsController } from './controllers/students.controller';
import { StudentsService } from './services/students.service';
import { Student } from './entities/student.entity';
import { Guardian } from './entities/guardian.entity';
import { StudentDocument } from './entities/student-document.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Guardian, StudentDocument]),
    ConfigModule,
    NotificationsModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}

