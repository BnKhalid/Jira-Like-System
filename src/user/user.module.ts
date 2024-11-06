import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    ConfigModule
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
