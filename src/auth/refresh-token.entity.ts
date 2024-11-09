import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class RefreshToken {
  @PrimaryKey()
  userId: string;
  
  @Property({ unique: true })
  token: string;
}
