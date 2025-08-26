import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from './entities/class.entity';
import { Section } from './entities/section.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { AcademicYear } from '../academic/entities/academic-year.entity';
import { Subject } from '../academic/entities/subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Class,
      Section,
      Student,
      User,
      AcademicYear,
      Subject,
    ]),
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}

