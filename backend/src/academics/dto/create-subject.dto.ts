import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateSubjectDto {
  @IsString() code: string;
  @IsString() name: string;
  @IsNumber() coefficient: number;
  @IsNumber() hours_per_week: number;
  @IsOptional() @IsString() description?: string;
}