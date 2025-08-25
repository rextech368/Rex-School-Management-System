import { IsString, IsDateString, IsOptional, IsArray } from 'class-validator';

export class CreateRegistrationDto {
  @IsString() applicant_name: string;
  @IsDateString() dob: string;
  @IsString() phone: string;
  @IsOptional() @IsString() email?: string;
  @IsString() desired_class: string;
  @IsOptional() @IsString() desired_section?: string;
  @IsOptional() @IsArray() subjects_selected?: any[];
  @IsOptional() @IsString() report_card_url?: string;
  @IsOptional() @IsString() application_letter_url?: string;
}