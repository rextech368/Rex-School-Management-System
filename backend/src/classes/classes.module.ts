import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClassesController } from './controllers/classes.controller';
import { ClassesService } from './services/classes.service';
import { Course } from './entities/course.entity';
import { Class } from './entities/class.entity';
import { Term } from './entities/term.entity';
import { ClassSchedule } from './entities/class-schedule.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Class, Term, ClassSchedule, Student, User]),
    ConfigModule,
    NotificationsModule,
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}

