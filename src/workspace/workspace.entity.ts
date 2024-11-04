import {Entity, PrimaryKey, Property, Collection, OneToMany, Cascade,} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Sprint } from './sprint/sprint.entity';
import { WorkspaceMember } from './workspace-member/workspace-member.entity';
import { TrackedEntity } from '../common/entities/tracked.entity';
import { WorkspaceMemberRoleEnum } from '../common/enums/workspace-member-role.enum';

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
    { cascade: [Cascade.REMOVE] }
  )
  workspaceMembers = new Collection<WorkspaceMember>(this);

  //#region Helper methods
  
  hasLeaderPermission(userId: string): boolean {
    return this.workspaceMembers.getItems().some(
      (member) => member.user.id === userId && member.role === WorkspaceMemberRoleEnum.Leader
    );
  }

  hasAdminPermission(userId: string): boolean {
    return this.workspaceMembers.getItems().some(
      (member) => member.user.id === userId && member.role !== WorkspaceMemberRoleEnum.Member
    );
  }

  hasMemberPermission(userId: string): boolean {
    return this.workspaceMembers.getItems().some(
      (member) => member.user.id === userId
    );
  }

  //#endregion
}
