import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateExamDto {
  @IsString() name: string;
  @IsNumber() academic_year: number;
  @IsNumber() term: number;
  @IsDateString() start_date: string;
  @IsDateString() end_date: string;
}