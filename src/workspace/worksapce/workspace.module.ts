import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Workspace } from './workspace.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Workspace])],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
