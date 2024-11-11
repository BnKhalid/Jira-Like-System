import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, ManyToMany, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../user/user.entity';
import { Label } from '../label/label.entity';
import { TaskLink } from '../task-link/task-link.entity';
import { TaskTypeEnum } from '../../common/enums/task-type.enum';
import { TaskStatusEnum } from '../../common/enums/task-status.enum';
import { TrackedEntity } from '../../common/entities/tracked.entity';
import { Workspace } from '../../workspace/workspace/workspace.entity';

@Entity()
export class Task extends TrackedEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  type!: TaskTypeEnum;

  @Property()
  status = TaskStatusEnum.TO_DO;

  @Property()
  summary!: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToOne(() => User, { nullable: true })
  assignee?: User;

  @ManyToOne(() => User, { nullable: true })
  reporter?: User;

  @ManyToOne(() => Task, { nullable: true })
  parentTask?: Task;

  @OneToMany(
    () => TaskLink, (link) => link.sourceTask,
    { cascade: [Cascade.REMOVE] }
  )
  outgoingLinks = new Collection<TaskLink>(this);

  @OneToMany(
    () => TaskLink, (link) => link.targetTask,
    { cascade: [Cascade.REMOVE] }
  )
  incomingLinks = new Collection<TaskLink>(this);

  @ManyToMany(
    () => Label, (link) => link.tasks,
    { cascade: [Cascade.REMOVE] }
  )
  labels = new Collection<Label>(this);

  @ManyToOne(() => Workspace)
  workspace!: Workspace;
}
