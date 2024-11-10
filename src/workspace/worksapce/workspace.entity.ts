import { Entity, PrimaryKey, Property, Collection, OneToMany, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Sprint } from '../sprint/sprint/sprint.entity'
import { WorkspaceMember } from '../workspace-member/workspace-member.entity';
import { TrackedEntity } from '../../common/entities/tracked.entity';
import { Task } from '../../task/task/task.entity';

@Entity()
export class Workspace extends TrackedEntity {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  name!: string;

  @Property()
  key!: string;

  @OneToMany(
    () => Sprint,
    sprint => sprint.workspace,
    { cascade: [Cascade.REMOVE] }
  )
  sprints = new Collection<Sprint>(this);

  @OneToMany(
    () => WorkspaceMember,
    workspaceMember => workspaceMember.workspace,
    { cascade: [Cascade.REMOVE] }
  )
  workspaceMembers = new Collection<WorkspaceMember>(this);

  @OneToMany(
    () => Task,
    task => task.workspace,
    { cascade: [Cascade.REMOVE] }
  )
  tasks = new Collection<Task>(this);
}
