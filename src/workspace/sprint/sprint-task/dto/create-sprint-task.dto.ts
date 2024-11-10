import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { SprintTaskPriorityEnum } from '../../../../common/enums/sprint-task-priority.enum';

export class CreateSprintTaskDto {
  @IsNotEmpty()
  @IsUUID()
  taskId: string;

  @IsNotEmpty()
  @IsNumber()
  storyPointEstimate: number;

  @IsOptional()
  @IsEnum(SprintTaskPriorityEnum)
  priority: SprintTaskPriorityEnum;
}
