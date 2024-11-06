import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../user/user.entity';
import { Workspace } from '../workspace.entity';
import { WorkspaceMemberRoleEnum } from '../../common/enums/workspace-member-role.enum';

@Entity()
export class WorkspaceMember {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property()
  role = WorkspaceMemberRoleEnum.MEMBER;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Workspace)
  workspace!: Workspace;
}
