import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { BacklogTaskPriorityEnum } from '../../../../common/enums/backlog-task-priority.enum';

export class UpdateBacklogTaskDto {
  @IsOptional()
  @IsNumber()
  storyPointEstimate: number;

  @IsOptional()
  @IsEnum(BacklogTaskPriorityEnum)
  priority: BacklogTaskPriorityEnum;
}
