import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WorkspaceModule } from '../workspace/workspace.module';
import { Task } from './task.entity';
import { UserModule } from '../user/user.module';
import { TaskLink } from './task-link/task-link.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Task, TaskLink]),
    WorkspaceModule,
    UserModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
