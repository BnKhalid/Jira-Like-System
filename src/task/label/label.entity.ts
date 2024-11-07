import { Entity, PrimaryKey, ManyToMany, Collection } from '@mikro-orm/core';
import { Task } from '../task.entity';

@Entity()
export class Label {
  @PrimaryKey()
  labelContent!: string;

  @ManyToMany(() => Task, (task) => task.labels, { mappedBy: 'labels' })
  tasks = new Collection<Task>(this);
}
