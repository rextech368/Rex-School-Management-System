import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entities
import { Student } from './entities/student.entity';
import { Parent } from './entities/parent.entity';
import { StudentDocument } from './entities/student-document.entity';
import { StudentGroup } from './entities/student-group.entity';
import { User } from '../users/entities/user.entity';

// Controllers
import { 
  StudentsController, 
  ParentsController,
  StudentDocumentsController,
  StudentGroupsController
} from './controllers';
import { StudentExportController } from './student-export.controller';

// Services
import { 
  StudentsService, 
  ParentsService,
  StudentDocumentsService,
  StudentGroupsService
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student, 
      Parent, 
      StudentDocument, 
      StudentGroup, 
      User
    ]),
    ConfigModule,
  ],
  controllers: [
    StudentsController, 
    ParentsController,
    StudentDocumentsController,
    StudentGroupsController,
    StudentExportController
  ],
  providers: [
    StudentsService, 
    ParentsService,
    StudentDocumentsService,
    StudentGroupsService
  ],
  exports: [
    StudentsService, 
    ParentsService,
    StudentDocumentsService,
    StudentGroupsService
  ],
})
export class StudentsModule {}

