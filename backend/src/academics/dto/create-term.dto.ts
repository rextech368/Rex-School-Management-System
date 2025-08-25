import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateTermDto {
  @IsNumber() academic_year: number;
  @IsString() name: string;
  @IsDateString() start_date: string;
  @IsDateString() end_date: string;
  @IsNumber() sequence_count: number;
}