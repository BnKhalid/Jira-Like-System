import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, ManyToMany, Cascade, OneToOne } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../user/user.entity';
import { Label } from '../label/label.entity';
import { TaskLink } from '../task-link/task-link.entity';
import { TaskTypeEnum } from '../../common/enums/task-type.enum';
import { TaskStatusEnum } from '../../common/enums/task-status.enum';
import { TrackedEntity } from '../../common/entities/tracked.entity';
import { Workspace } from '../../workspace/workspace/workspace.entity';
import { SprintTask } from '../../workspace/sprint/sprint-task/sprint-task.entity';

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

  @ManyToOne(() => Workspace, { deleteRule: 'cascade' })
  workspace!: Workspace;

  @ManyToOne(() => User, { nullable: true })
  assignee?: User;

  @ManyToOne(() => User, { nullable: true })
  reporter?: User;

  @ManyToOne(() => Task, { nullable: true, deleteRule: 'set null' })
  parentTask?: Task;

  @OneToMany(() => TaskLink, (link) => link.sourceTask, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  outgoingLinks = new Collection<TaskLink>(this);

  @OneToMany(() => TaskLink, (link) => link.targetTask, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  incomingLinks = new Collection<TaskLink>(this);

  @ManyToMany(() => Label, (link) => link.tasks, { cascade: [Cascade.ALL] })
  labels = new Collection<Label>(this);

  @OneToOne(() => SprintTask, (sprintTask) => sprintTask.task, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  sprintTask?: SprintTask;
}
