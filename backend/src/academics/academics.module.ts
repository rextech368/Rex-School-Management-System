import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicYearsController } from './academic-years.controller';
import { AcademicYearsService } from './academic-years.service';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { TermsController } from './terms.controller';
import { TermsService } from './terms.service';
import { AcademicYear } from './entities/academic-year.entity';
import { Class } from './entities/class.entity';
import { Level } from './entities/level.entity';
import { Section } from './entities/section.entity';
import { Subject } from './entities/subject.entity';
import { Term } from './entities/term.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademicYear,
      Class,
      Level,
      Section,
      Subject,
      Term,
    ]),
  ],
  controllers: [
    AcademicYearsController,
    ClassesController,
    LevelsController,
    SectionsController,
    SubjectsController,
    TermsController,
  ],
  providers: [
    AcademicYearsService,
    ClassesService,
    LevelsService,
    SectionsService,
    SubjectsService,
    TermsService,
  ],
  exports: [
    AcademicYearsService,
    ClassesService,
    LevelsService,
    SectionsService,
    SubjectsService,
    TermsService,
  ],
})
export class AcademicsModule {}

