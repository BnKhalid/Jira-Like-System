import {
  Entity,
  PrimaryKey,
  Property,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Sprint } from './sprint/sprint.entity';
import { WorkspaceMember } from './workspace-member/workspace-member.entity';
import { TrackedEntity } from '../common/entities/tracked.entity';

@Entity()
export class Workspace extends TrackedEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property()
  name!: string;

  @Property()
  key!: string;

  @OneToMany(() => Sprint, (sprint) => sprint.workspace)
  sprints = new Collection<Sprint>(this);

  @OneToMany(
    () => WorkspaceMember,
    (workspaceMember) => workspaceMember.workspace,
  )
  workspaceMembers = new Collection<WorkspaceMember>(this);
}
