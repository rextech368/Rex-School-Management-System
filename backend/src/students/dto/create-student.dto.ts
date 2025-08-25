import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateStudentDto {
  @IsString() first_name: string;
  @IsString() last_name: string;
  @IsDateString() dob: string;
  @IsString() gender: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() image_url?: string;
  @IsOptional() @IsString() guardian_name?: string;
  @IsOptional() @IsString() guardian_phone?: string;
  @IsDateString() admission_date: string;
  @IsOptional() @IsNumber() current_class?: number;
  @IsOptional() @IsNumber() current_section?: number;
  @IsOptional() @IsNumber() academic_year?: number;
}