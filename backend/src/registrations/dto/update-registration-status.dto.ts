import { IsString, IsOptional } from 'class-validator';

export class UpdateRegistrationStatusDto {
  @IsString() status: 'pending' | 'accepted' | 'rejected';
  @IsOptional() @IsString() admin_note?: string;
}