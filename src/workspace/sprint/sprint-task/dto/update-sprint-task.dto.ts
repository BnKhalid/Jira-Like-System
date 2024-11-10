import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SprintTaskPriorityEnum } from '../../../../common/enums/sprint-task-priority.enum';

export class UpdateSprintTaskDto {
  @IsOptional()
  @IsNumber()
  storyPointEstimate: number;

  @IsOptional()
  @IsEnum(SprintTaskPriorityEnum)
  priority: SprintTaskPriorityEnum;
}
