import { Entity, PrimaryKey, Property, Collection, OneToMany, Cascade } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Sprint } from '../sprint/sprint/sprint.entity'
import { WorkspaceMember } from '../workspace-member/workspace-member.entity';
import { TrackedEntity } from '../../common/entities/tracked.entity';
import { Task } from '../../task/task/task.entity';
import { Label } from '../../task/label/label.entity';

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
    { cascade: [Cascade.ALL], orphanRemoval: true }
  )
  sprints = new Collection<Sprint>(this);

  @OneToMany(
    () => WorkspaceMember,
    workspaceMember => workspaceMember.workspace,
    { cascade: [Cascade.ALL], orphanRemoval: true }
  )
  workspaceMembers = new Collection<WorkspaceMember>(this);

  @OneToMany(
    () => Task,
    task => task.workspace,
    { cascade: [Cascade.ALL], orphanRemoval: true }
  )
  tasks = new Collection<Task>(this);

  @OneToMany(
    () => Label,
    label => label.workspace,
    { cascade: [Cascade.ALL], orphanRemoval: true }
  )
  labels = new Collection<Label>(this);
}
