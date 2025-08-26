import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entities
import { Student } from './entities/student.entity';
import { Program } from './entities/program.entity';
import { Guardian } from './entities/guardian.entity';
import { Document } from './entities/document.entity';
import { ExportTemplate } from './entities/export-template.entity';

// Controllers
import { StudentsController } from './controllers/students.controller';
import { ProgramsController } from './controllers/programs.controller';
import { GuardiansController } from './controllers/guardians.controller';
import { DocumentsController } from './controllers/documents.controller';
import { StudentExportController } from './controllers/export/student-export.controller';

// Services
import { StudentsService } from './services/students.service';
import { ProgramsService } from './services/programs.service';
import { GuardiansService } from './services/guardians.service';
import { DocumentsService } from './services/documents.service';
import { StudentExportService } from './services/export/student-export.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Program,
      Guardian,
      Document,
      ExportTemplate,
    ]),
    ConfigModule,
  ],
  controllers: [
    StudentsController,
    ProgramsController,
    GuardiansController,
    DocumentsController,
    StudentExportController,
  ],
  providers: [
    StudentsService,
    ProgramsService,
    GuardiansService,
    DocumentsService,
    StudentExportService,
  ],
  exports: [
    StudentsService,
    ProgramsService,
    GuardiansService,
    DocumentsService,
    StudentExportService,
  ],
})
export class StudentsModule {}

