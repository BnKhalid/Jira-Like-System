import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateSprintDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  goal: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
