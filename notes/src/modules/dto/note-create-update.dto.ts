import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'modules/base/base.dto';

export class NoteCreateUpdateDto extends BaseDto {
  id!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;
}
