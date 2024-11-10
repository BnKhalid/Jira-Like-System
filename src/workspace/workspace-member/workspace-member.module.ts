import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WorkspaceMemberController } from './workspace-member.controller';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceMember } from './workspace-member.entity';
import { WorkspaceModule } from '../worksapce/workspace.module';
import { UserModule } from '../../user/user.module';
import { TaskModule } from '../../task/task/task.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([WorkspaceMember]),
    UserModule,
    WorkspaceModule,
    TaskModule,
  ],
  controllers: [WorkspaceMemberController],
  providers: [WorkspaceMemberService],
  exports: [WorkspaceMemberService],
})
export class WorkspaceMemberModule { }
