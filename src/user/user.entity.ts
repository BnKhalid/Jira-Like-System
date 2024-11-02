import {
  Entity,
  PrimaryKey,
  Property,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../task/task.entity';
import { WorkspaceMember } from '../workspace-member/workspace-member.entity';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property()
  name!: string;

  @Property({ unique: true })
  username!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ hidden: true })
  password!: string;

  @Property()
  phone!: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks = new Collection<Task>(this);

  @OneToMany(() => Task, (task) => task.reporter)
  reportedTasks = new Collection<Task>(this);

  @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.user)
  workspaceMemberships = new Collection<WorkspaceMember>(this);
}
