import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../user/user.entity';
import { Workspace } from '../workspace/workspace.entity';
import { Role } from '../../common/enums/role.enum';

@Entity()
export class WorkspaceMember {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  role = Role.MEMBER;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Workspace)
  workspace!: Workspace;
}
