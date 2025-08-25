import { IsString, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAcademicYearDto {
  @IsString()
  name: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}