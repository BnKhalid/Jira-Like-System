import { Entity, PrimaryKey, Property, Collection, OneToMany } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { compare } from 'bcrypt';
import { Task } from '../task/task/task.entity';
import { WorkspaceMember } from '../workspace/workspace-member/workspace-member.entity';
import { IsEmail } from 'class-validator';

@Entity()
export class User {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  name!: string;

  @Property({ unique: true })
  username!: string;

  @IsEmail()
  @Property({ unique: true })
  email!: string;

  @Property({ hidden: true })
  password!: string;

  @Property()
  phone!: string;

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks = new Collection<Task>(this);

  @OneToMany(() => Task, (task) => task.reporter)
  reportedTasks = new Collection<Task>(this);

  @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.user)
  workspaceMemberships = new Collection<WorkspaceMember>(this);
}
