import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entities
import { GradeItem } from './entities/grade-item.entity';
import { GradeEntry } from './entities/grade-entry.entity';
import { GradeTemplate } from './entities/grade-template.entity';
import { Student } from '../students/entities/student.entity';

// Controllers
import { GradesController } from './controllers/grades.controller';

// Services
import { GradesService } from './services/grades.service';

// Import NotificationsModule for sending grade notifications
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GradeItem, GradeEntry, GradeTemplate, Student]),
    ConfigModule,
    NotificationsModule,
  ],
  controllers: [GradesController],
  providers: [GradesService],
  exports: [GradesService],
})
export class GradesModule {}

