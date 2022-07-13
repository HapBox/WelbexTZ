import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '../base/base.dto';

export class AuthInfoDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  mail!: string;

  @IsString()
  password!: string;
}
