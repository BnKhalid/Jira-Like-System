import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import mikroOrmConfig from './mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { WorkspaceModule } from './workspace/workspace.module';
import { WorkspaceMemberModule } from './workspace/workspace-member/workspace-member.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { TaskLinkModule } from './task/task-link/task-link.module';
import { LabelModule } from './task/label/label.module';
import { SprintModule } from './workspace/sprint/sprint.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    ConfigModule.forRoot(),
    AuthModule,
    WorkspaceModule,
    WorkspaceMemberModule,
    UserModule,
    TaskModule,
    TaskLinkModule,
    LabelModule,
    SprintModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
