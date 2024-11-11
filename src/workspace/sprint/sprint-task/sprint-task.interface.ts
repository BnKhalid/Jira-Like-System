import { SprintTaskPriorityEnum } from "../../../common/enums/sprint-task-priority.enum";
import { TaskFilters } from "../../../task/task/task-filters.interface";

export interface SprintTaskFilters extends TaskFilters {
  priority?: SprintTaskPriorityEnum;
  storyPointEstimate?: number;
}