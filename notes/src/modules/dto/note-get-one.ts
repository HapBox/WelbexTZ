import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'modules/base/base.dto';

export class NoteGetOneDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;
}
