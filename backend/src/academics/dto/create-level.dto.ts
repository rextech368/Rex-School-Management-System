import { IsString, IsOptional } from 'class-validator';
export class CreateLevelDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
}