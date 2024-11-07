import { Entity, PrimaryKey, Property, BeforeCreate, BeforeUpdate, ManyToOne, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Workspace } from '../workspace.entity';
import { BacklogTask } from '../../task/backlog-task/backlog-task.entity';
import { TrackedEntity } from '../../common/entities/tracked.entity';
import { ForbiddenException } from '@nestjs/common';

@Entity()
export class Sprint extends TrackedEntity {
  @PrimaryKey({ type: 'uuid' })
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
    () => BacklogTask,
    (backlogTask) => backlogTask.sprint,
    { cascade: [Cascade.REMOVE] }
  )
  backlog = new Collection<BacklogTask>(this);

  @BeforeCreate()
  @BeforeUpdate()
  validateDates() {
    if (this.startDate >= this.endDate) {
      throw new ForbiddenException('End date must be after start date');
    }
  }
}
