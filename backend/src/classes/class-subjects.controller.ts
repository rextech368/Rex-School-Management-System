import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ResultsService } from '../results/results.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassSubjectsController {
  constructor(private resultsService: ResultsService) {}

  @Get(':classId/:examId/subjects')
  @Roles('Admin', 'Principal', 'Head Teacher')
  async getSubjects(
    @Param('classId') classId: string,
    @Param('examId') examId: string
  ) {
    // Query all students' results for this class/exam and extract subject names
    const results = await this.resultsService.getClassExamResults(+classId, +examId);
    const subjectSet = new Set<string>();
    results.forEach((r: any) => {
      r.subjects.forEach((s: any) => subjectSet.add(s.name));
    });
    return Array.from(subjectSet);
  }
}