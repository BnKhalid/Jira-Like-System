import { Module } from '@nestjs/common';
import { TaskLinkService } from './task-link.service';
import { TaskLinkController } from './task-link.controller';
import { TaskLink } from './task-link.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TaskModule } from '../task/task.module';
import { WorkspaceModule } from '../../workspace/worksapce/workspace.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([TaskLink]),
    TaskModule,
    WorkspaceModule
  ],
  controllers: [TaskLinkController],
  providers: [TaskLinkService],
  exports: [TaskLinkService]
})
export class TaskLinkModule {}
