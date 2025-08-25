import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';
import { StudentExportController } from './student-export.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentsController, StudentExportController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}

