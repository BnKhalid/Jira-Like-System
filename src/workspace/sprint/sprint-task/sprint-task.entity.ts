import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Sprint } from '../sprint/sprint.entity';
import { Task } from '../../../task/task/task.entity';
import { SprintTaskPriorityEnum } from '../../../common/enums/sprint-task-priority.enum';

@Entity()
export class SprintTask {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  priority = SprintTaskPriorityEnum.MEDIUM;

  @Property()
  storyPointEstimate!: number;

  @OneToOne(() => Task, (task) => task.sprintTask, { owner: true, deleteRule: 'cascade' })
  task!: Task;

  @ManyToOne(() => Sprint, { deleteRule: 'cascade' })
  sprint!: Sprint;
}
