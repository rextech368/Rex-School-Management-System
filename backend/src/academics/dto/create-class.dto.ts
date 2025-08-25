import { IsString, IsNumber } from 'class-validator';

export class CreateClassDto {
  @IsNumber() level: number;
  @IsString() name: string;
  @IsString() code: string;
  @IsNumber() default_promotion_threshold: number;
  @IsString() group_type: string;
}