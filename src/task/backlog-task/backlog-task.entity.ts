import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Sprint } from '../../workspace/sprint/sprint.entity';
import { Task } from '../task.entity';

@Entity()
export class BacklogTask {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property()
  priority!: number;

  @Property()
  storyPointEstimate!: number;

  @OneToOne(() => Task)
  task!: Task;

  @ManyToOne(() => Sprint)
  sprint!: Sprint;
}
