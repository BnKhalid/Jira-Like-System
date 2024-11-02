import {
  Entity,
  PrimaryKey,
  Property,
  BeforeCreate,
  BeforeUpdate,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { Workspace } from '../workspace/workspace.entity';
import { BacklogTask } from '../backlog-task/backlog-task.entity';
import { TrackedEntity } from '../common/entities/tracked.entity';

@Entity()
export class Sprint extends TrackedEntity {
  @PrimaryKey({ autoincrement: true })
  id!: number;

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

  @OneToMany(() => BacklogTask, (backlogTask) => backlogTask.sprint)
  backlogTasks = new Collection<BacklogTask>(this);

  @BeforeCreate()
  @BeforeUpdate()
  validateDates() {
    if (this.startDate >= this.endDate) {
      throw new Error('Start date must be before end date.');
    }
  }
}
