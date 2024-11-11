import { Module } from '@nestjs/common';
import { SprintTaskService } from './sprint-task.service';
import { SprintTaskController } from './sprint-task.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SprintTask } from './sprint-task.entity';
import { SprintModule } from '../sprint/sprint.module';
import { TaskModule } from '../../../task/task/task.module';
import { WorkspaceModule } from '../../workspace/workspace.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([SprintTask]),
    WorkspaceModule,
    SprintModule,
    TaskModule
  ],
  controllers: [SprintTaskController],
  providers: [SprintTaskService],
  exports: [SprintTaskService]
})
export class SprintTaskModule {}
