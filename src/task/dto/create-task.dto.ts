import { TaskTypeEnum } from "src/common/enums/task-type.enum";
import { TaskStatusEnum } from "../../common/enums/task-status.enum"

export class CreateTaskDto {
  type!: TaskTypeEnum;
  status? = TaskStatusEnum.TO_DO;
  summary!: string;
  description?: string;
  assigneeId!: string;
  reporterId?: string;
}
