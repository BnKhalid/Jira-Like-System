import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { WorkspaceMember } from './workspace-member.entity';
import { CurrentUser } from 'src/auth/decorators/get-user.decorator';
import { UserClaims } from 'src/auth/user-claims.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/workspaces/:workspaceId/members/')
export class WorkspaceMemberController {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  @Post(':memberId')
  create(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('memberId', new ParseUUIDPipe({ version: '4' })) memberId: string,
    @Body() createWorkspaceMemberDto: CreateWorkspaceMemberDto,
    @CurrentUser() user: UserClaims,
  ): Promise<WorkspaceMember> {
    return this.workspaceMemberService.create(
      workspaceId,
      memberId,
      createWorkspaceMemberDto,
      user
    );
  }

  @Get()
  findAll(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
  ): Promise<WorkspaceMember[]> {
    return this.workspaceMemberService.findAll(workspaceId);
  }

  @Get('me')
  findMe(
    @CurrentUser() user: UserClaims,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
  ): Promise<WorkspaceMember> {
    return this.workspaceMemberService.findOne(workspaceId, user.id);
  }

  @Get(':memberId')
  findOne(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Param('memberId', new ParseUUIDPipe({ version: '4' })) memberId: string,
  ): Promise<WorkspaceMember> {
    return this.workspaceMemberService.findOne(workspaceId, memberId);
  }

  @Patch(':memberId')
  update(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('memberId', new ParseUUIDPipe({ version: '4' })) memberId: string,
    @Body() updateWorkspaceMemberDto: UpdateWorkspaceMemberDto,
    @CurrentUser() user: UserClaims,
  ): Promise<WorkspaceMember> {
    return this.workspaceMemberService.update(
      workspaceId,
      memberId,
      updateWorkspaceMemberDto,
      user
    );
  }

  @Delete('me')
  leave(
    @CurrentUser() user: UserClaims,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
  ): Promise<void> {
    return this.workspaceMemberService.remove(workspaceId, user.id, user);
  }

  @Delete(':memberId')
  remove(
    @CurrentUser() user: UserClaims,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('memberId', new ParseUUIDPipe({ version: '4' })) memberId: string,
  ): Promise<void> {
    return this.workspaceMemberService.remove(workspaceId, memberId, user);
  }
}
