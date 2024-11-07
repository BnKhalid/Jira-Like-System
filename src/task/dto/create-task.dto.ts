import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskTypeEnum } from '../../common/enums/task-type.enum';
import { TaskStatusEnum } from '../../common/enums/task-status.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsEnum(TaskTypeEnum)
  type!: TaskTypeEnum;

  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status? = TaskStatusEnum.TO_DO;

  @IsNotEmpty()
  @IsString()
  summary!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsUUID()
  assigneeId!: string;

  @IsOptional()
  @IsUUID()
  reporterId?: string;

  @IsOptional()
  @IsUUID()
  parentTaskId?: string;
}
