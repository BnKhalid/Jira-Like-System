import { Entity, ManyToOne, OneToOne, PrimaryKey, Property, Cascade } from '@mikro-orm/core';
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

  @OneToOne(
    () => Task,
    { cascade: [Cascade.REMOVE] }
  )
  task!: Task;

  @ManyToOne(() => Sprint)
  sprint!: Sprint;
}
