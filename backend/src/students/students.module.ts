import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';
import { StudentExportController } from './student-export.controller';
import { User } from '../users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, User]),
    ConfigModule,
  ],
  controllers: [StudentsController, StudentExportController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}

