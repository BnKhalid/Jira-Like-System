import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @IsNotEmpty()
  labelContent: string;
}
