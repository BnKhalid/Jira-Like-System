import { Property } from '@mikro-orm/core';

export abstract class TrackedEntity {
  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
