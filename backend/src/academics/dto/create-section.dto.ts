import { IsString, IsNumber } from 'class-validator';

export class CreateSectionDto {
  @IsNumber() class: number;
  @IsString() name: string;
}