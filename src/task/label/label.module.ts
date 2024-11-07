import { Module } from '@nestjs/common';
import { LabelService } from './label.service';
import { LabelController } from './label.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Label } from './label.entity';
import { WorkspaceModule } from '../../workspace/workspace.module';
import { TaskModule } from '../task.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Label]),
    WorkspaceModule,
    TaskModule
  ],
  controllers: [LabelController],
  providers: [LabelService],
  exports: [LabelService]
})
export class LabelModule {}
