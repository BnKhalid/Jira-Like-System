import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import mikroOrmConfig from './mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { WorkspaceModule } from './workspace/worksapce/workspace.module';
import { WorkspaceMemberModule } from './workspace/workspace-member/workspace-member.module';
import { TaskModule } from './task/task/task.module';
import { UserModule } from './user/user.module';
import { TaskLinkModule } from './task/task-link/task-link.module';
import { LabelModule } from './task/label/label.module';
import { SprintModule } from './workspace/sprint/sprint/sprint.module';
import { SprintTaskModule } from './workspace/sprint/sprint-task/sprint-task.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

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
    SprintTaskModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
