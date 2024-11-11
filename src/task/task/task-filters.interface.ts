import { TaskStatusEnum } from '../../common/enums/task-status.enum';
import { TaskTypeEnum } from '../../common/enums/task-type.enum';


export interface TaskFilters {
  status?: TaskStatusEnum;
  type?: TaskTypeEnum;
  parentTaskId?: string;
  assigneeId?: string;
  reporterId?: string;
  labels?: string[];
}