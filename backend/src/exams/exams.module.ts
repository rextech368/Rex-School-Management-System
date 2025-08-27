import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { MarksController } from './marks.controller';
import { MarksService } from './marks.service';
import { Exam } from './entities/exam.entity';
import { Mark } from './entities/mark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Mark])],
  controllers: [ExamsController, MarksController],
  providers: [ExamsService, MarksService],
  exports: [ExamsService, MarksService],
})
export class ExamsModule {}

