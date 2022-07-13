import { IsString, IsOptional } from 'class-validator';
import { BaseDto } from '../base/base.dto';

export class UserPatchDto extends BaseDto {
  id!: string;

  @IsOptional()
  @IsString()
  mail!: string;

  @IsOptional()
  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  firstName!: string;

  @IsOptional()
  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  description!: string;
}
