import { TaskLinkTypeEnum } from '../../../common/enums/task-link-type.enum'

export class CreateTaskLinkDto {
  targetTaskId!: string;
  linkType!: TaskLinkTypeEnum;
}