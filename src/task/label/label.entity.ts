import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { Task } from '../task.entity';

@Entity()
export class Label {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @ManyToMany(() => Task, (task) => task.labels, { mappedBy: 'labels' })
  tasks = new Collection<Task>(this);
}
