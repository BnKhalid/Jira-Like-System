import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, BeforeCreate, BeforeUpdate, ManyToMany, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../user/user.entity';
import { Label } from '../label/label.entity';
import { TaskLink } from '../task-link/task-link.entity';
import { TaskTypeEnum } from '../../common/enums/task-type.enum';
import { TaskStatusEnum } from '../../common/enums/task-status.enum';
import { TrackedEntity } from '../../common/entities/tracked.entity';
import { BadRequestException } from '@nestjs/common';
import { Workspace } from '../../workspace/worksapce/workspace.entity';

@Entity()
export class Task extends TrackedEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property()
  type!: TaskTypeEnum;

  @Property()
  status = TaskStatusEnum.TO_DO;

  @Property()
  summary!: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToOne(() => User)
  assignee!: User;

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

  @BeforeCreate()
  @BeforeUpdate()
  validateParentTask() {
    if (this.type === TaskTypeEnum.EPIC && this.parentTask) {
      throw new BadRequestException('An Epic task cannot have a parent task.');
    }

    if (this.type !== TaskTypeEnum.EPIC && this.parentTask?.type === TaskTypeEnum.SUB_TASK) {
      throw new BadRequestException(
        'User Story, Task and Bug types cannot have a Sub Task as a parent task.',
      );
    }

    if (this.type === TaskTypeEnum.SUB_TASK) {
      if (!this.parentTask) {
        throw new BadRequestException('Sub Task must have a parent task.');
      }
      
      if (this.parentTask?.type === TaskTypeEnum.EPIC) {
        throw new BadRequestException(
          'Sub Task types cannot have an Epic type as a parent task.',
        );
      }
    }
  }
}
