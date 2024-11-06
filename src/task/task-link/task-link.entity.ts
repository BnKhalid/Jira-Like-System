import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../task.entity';
import { TaskLinkTypeEnum } from '../../common/enums/task-link-type.enum';

@Entity()
export class TaskLink {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property()
  linkType!: TaskLinkTypeEnum;

  @ManyToOne(() => Task)
  sourceTask!: Task;

  @ManyToOne(() => Task)
  targetTask!: Task;
}
