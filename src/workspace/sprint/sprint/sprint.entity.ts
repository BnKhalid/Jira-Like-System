import { Entity, PrimaryKey, Property, BeforeCreate, BeforeUpdate, ManyToOne, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Workspace } from '../../worksapce/workspace.entity';
import { SprintTask } from '../sprint-task/sprint-task.entity';
import { TrackedEntity } from '../../../common/entities/tracked.entity';
import { BadRequestException } from '@nestjs/common';

@Entity()
export class Sprint extends TrackedEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  name!: string;

  @Property({ nullable: true })
  goal?: string;

  @Property()
  startDate!: Date;

  @Property()
  endDate!: Date;

  @ManyToOne(() => Workspace)
  workspace!: Workspace;

  @OneToMany(
    () => SprintTask,
    (sprintTask) => sprintTask.sprint,
    { cascade: [Cascade.REMOVE] }
  )
  sprintTasks = new Collection<SprintTask>(this);
}
