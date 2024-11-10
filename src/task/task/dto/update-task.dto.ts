import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskStatusEnum } from '../../../common/enums/task-status.enum';
import { TaskTypeEnum } from '../../../common/enums/task-type.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsEnum(TaskTypeEnum)
  type?: TaskTypeEnum;

  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsUUID()
  reporterId?: string;

  @IsOptional()
  @IsUUID()
  parentTaskId?: string;
}
