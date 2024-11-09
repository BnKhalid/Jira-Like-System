import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { BacklogTaskPriorityEnum } from '../../../../common/enums/backlog-task-priority.enum';

export class CreateBacklogTaskDto {
  @IsNotEmpty()
  @IsUUID()
  taskId: string;

  @IsNotEmpty()
  @IsNumber()
  storyPointEstimate: number;

  @IsOptional()
  @IsEnum(BacklogTaskPriorityEnum)
  priority: BacklogTaskPriorityEnum;
}
