import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { WorkspaceMember } from './workspace-member.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserClaims } from '../../auth/interfaces/user-claims.interface';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/workspaces/:workspaceId/members')
export class WorkspaceMemberController {
  constructor(
    private workspaceMemberService: WorkspaceMemberService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Param('workspaceId')
    workspaceId: string,
    @Body() createWorkspaceMemberDto: CreateWorkspaceMemberDto
  ): Promise<WorkspaceMember> {
    return this.workspaceMemberService.create(
      workspaceId,
      createWorkspaceMemberDto
    );
  }

  @Get()
  @Roles(Role.MEMBER)
  findAll(
    @Param('workspaceId')
    workspaceId: string,
  ): Promise<WorkspaceMember[]> {
    return this.workspaceMemberService.findAll(workspaceId);
  }

  @Get('me')
  findMe(
    @CurrentUser() user: UserClaims,
    @Param('workspaceId') workspaceId: string,
  ): Promise<WorkspaceMember> {
    return this.workspaceMemberService.findOne(workspaceId, user.id);
  }

  @Get(':memberId')
  @Roles(Role.MEMBER)
  findOne(
    @Param('workspaceId')
    workspaceId: string,
    @Param('memberId') memberId: string,
  ): Promise<WorkspaceMember> {
    return this.workspaceMemberService.findOne(workspaceId, memberId);
  }

  @Patch(':memberId')
  @Roles(Role.ADMIN)
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
    @Body() updateWorkspaceMemberDto: UpdateWorkspaceMemberDto
  ): Promise<WorkspaceMember> {
    return this.workspaceMemberService.update(
      workspaceId,
      memberId,
      updateWorkspaceMemberDto
    );
  }

  @Delete('me')
  leave(
    @CurrentUser() user: UserClaims,
    @Param('workspaceId') workspaceId: string,
  ): Promise<void> {
    return this.workspaceMemberService.remove(workspaceId, user.id, user);
  }

  @Delete(':memberId')
  @Roles(Role.ADMIN)
  remove(
    @CurrentUser() user: UserClaims,
    @Param('workspaceId') workspaceId: string,
    @Param('memberId') memberId: string,
  ): Promise<void> {
    return this.workspaceMemberService.remove(workspaceId, memberId, user);
  }
}
