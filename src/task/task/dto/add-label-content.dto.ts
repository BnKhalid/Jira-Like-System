import { IsNotEmpty, IsString } from 'class-validator';

export class AddLabelDto {
  @IsString()
  @IsNotEmpty()
  labelContent: string;
}
