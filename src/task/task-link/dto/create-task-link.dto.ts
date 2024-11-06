import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { TaskLinkTypeEnum } from '../../../common/enums/task-link-type.enum'

export class CreateTaskLinkDto {
  @IsNotEmpty()
  @IsUUID()
  targetTaskId!: string;

  @IsNotEmpty()
  @IsEnum(TaskLinkTypeEnum)
  linkType!: TaskLinkTypeEnum;
}