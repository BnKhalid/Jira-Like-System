import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { SprintController } from './sprint.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Sprint } from './sprint.entity';
import { WorkspaceModule } from '../../workspace/workspace.module'; 

@Module({
  imports: [
    MikroOrmModule.forFeature([Sprint]),
    WorkspaceModule
  ],
  controllers: [SprintController],
  providers: [SprintService],
  exports: [SprintService]
})
export class SprintModule {}
