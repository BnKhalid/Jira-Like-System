import { Entity, ManyToOne, OneToOne, PrimaryKey, Property, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Sprint } from '../sprint/sprint.entity';
import { Task } from '../../../task/task/task.entity';
import { BacklogTaskPriorityEnum } from '../../../common/enums/backlog-task-priority.enum';

@Entity()
export class BacklogTask {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  priority = BacklogTaskPriorityEnum.MEDIUM;

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