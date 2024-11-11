import { Entity, PrimaryKey, ManyToMany, Collection, ManyToOne, Property } from '@mikro-orm/core';
import { Task } from '../task/task.entity';
import { v4 as uuidv4 } from 'uuid';
import { Workspace } from '../../workspace/workspace/workspace.entity';

@Entity()
export class Label {
  @PrimaryKey()
  id: string = uuidv4();

  @Property({ nullable: false })
  content!: string;

  @ManyToMany(
    () => Task,
    (task) => task.labels,
    { owner: true }
  )
  tasks = new Collection<Task>(this);

  @ManyToOne(() => Workspace, { deleteRule: 'cascade' })
  workspace!: Workspace;
}
