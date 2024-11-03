import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  BeforeCreate,
  BeforeUpdate,
  ManyToMany,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.entity';
import { Label } from './label/label.entity';
import { TaskLink } from './task-link/task-link.entity';
import { TaskTypeEnum } from '../common/enums/task-type.enum';
import { TaskStatusEnum } from '../common/enums/task-status.enum';
import { TrackedEntity } from '../common/entities/tracked.entity';

@Entity()
export class Task extends TrackedEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property()
  type!: TaskTypeEnum;

  @Property()
  status!: TaskStatusEnum;

  @Property()
  summary!: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => User, { nullable: true })
  reporter?: User;

  @ManyToOne(() => Task, { nullable: true })
  parentTask?: Task;

  @OneToMany(() => TaskLink, (link) => link.sourceTask)
  outgoingLinks = new Collection<TaskLink>(this);

  @OneToMany(() => TaskLink, (link) => link.targetTask)
  incomingLinks = new Collection<TaskLink>(this);

  @ManyToMany(() => Label)
  labels = new Collection<Label>(this);

  @BeforeCreate()
  @BeforeUpdate()
  validateParentTask() {
    if (this.type === TaskTypeEnum.EPIC && this.parentTask) {
      throw new Error('An Epic task cannot have a parent task.');
    }

    if (
      (this.type === TaskTypeEnum.USER_STORY ||
        this.type === TaskTypeEnum.TASK ||
        this.type === TaskTypeEnum.BUG) &&
      this.parentTask &&
      this.parentTask.type === TaskTypeEnum.SUB_TASK
    ) {
      throw new Error(
        'User Story, Task and Bug types cannot have a Sub Task as a parent task.',
      );
    }

    if (
      this.type === TaskTypeEnum.SUB_TASK &&
      this.parentTask &&
      this.parentTask.type === TaskTypeEnum.EPIC
    ) {
      throw new Error(
        'Sub Task types cannot have an Epic type as a parent task.',
      );
    }
  }
}
