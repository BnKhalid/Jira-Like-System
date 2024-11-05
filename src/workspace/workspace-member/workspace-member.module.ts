import { Module } from "@nestjs/common";
import { Workspace } from "../workspace.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { WorkspaceMemberController } from "./workspace-member.controller";
import { WorkspaceMemberService } from "./workspace-member.service";
import { User } from "src/user/user.entity";
import { WorkspaceMember } from "./workspace-member.entity";
import { WorkspaceModule } from "../workspace.module";

@Module({
  imports: [
    MikroOrmModule.forFeature([User, Workspace, WorkspaceMember]),
    WorkspaceModule,
  ],
  controllers: [WorkspaceMemberController],
  providers: [WorkspaceMemberService],
  exports: [WorkspaceMemberService],
})
export class WorkspaceMemberModule { }
