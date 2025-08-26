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
  StudentGroupsController,
  StudentAccountController
} from './controllers';
import { StudentExportController } from './student-export.controller';

// Services
import { 
  StudentsService, 
  ParentsService,
  StudentDocumentsService,
  StudentGroupsService,
  StudentAccountService
} from './services';

// Import UsersModule to use UsersService
import { UsersModule } from '../users/users.module';

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
    UsersModule, // Import UsersModule to use UsersService
  ],
  controllers: [
    StudentsController, 
    ParentsController,
    StudentDocumentsController,
    StudentGroupsController,
    StudentAccountController,
    StudentExportController
  ],
  providers: [
    StudentsService, 
    ParentsService,
    StudentDocumentsService,
    StudentGroupsService,
    StudentAccountService
  ],
  exports: [
    StudentsService, 
    ParentsService,
    StudentDocumentsService,
    StudentGroupsService,
    StudentAccountService
  ],
})
export class StudentsModule {}

