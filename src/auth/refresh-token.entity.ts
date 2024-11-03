import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class RefreshToken {
  @PrimaryKey({ type: 'uuid' })
  userId: string;
  
  @Property({ type: 'uuid', unique: true })
  token: string = uuidv4();

  @Property({ type: 'date' })
  expiresAt: Date = new Date();
}
