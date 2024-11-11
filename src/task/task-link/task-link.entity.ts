import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../task/task.entity';
import { TaskLinkTypeEnum } from '../../common/enums/task-link-type.enum';

@Entity()
export class TaskLink {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  linkType!: TaskLinkTypeEnum;

  @ManyToOne(() => Task, { deleteRule: 'cascade' })
  sourceTask!: Task;

  @ManyToOne(() => Task, { deleteRule: 'cascade' })
  targetTask!: Task;
}
