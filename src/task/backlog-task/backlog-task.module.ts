import { Module } from '@nestjs/common';
import { BacklogTaskService } from './backlog-task.service';
import { BacklogTaskController } from './backlog-task.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BacklogTask } from './backlog-task.entity';
import { SprintModule } from '../../workspace/sprint/sprint.module';
import { TaskModule } from '../task.module';
import { WorkspaceModule } from '../../workspace/workspace.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([BacklogTask]),
    WorkspaceModule,
    SprintModule,
    TaskModule
  ],
  controllers: [BacklogTaskController],
  providers: [BacklogTaskService],
  exports: [BacklogTaskService]
})
export class BacklogTaskModule {}
