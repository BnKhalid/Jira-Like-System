import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from './workspace.entity';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserClaims } from '../../auth/interfaces/user-claims.interface';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/workspaces')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Post()
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @CurrentUser() user: UserClaims,
  ): Promise<Workspace> {
    return this.workspaceService.create(createWorkspaceDto, user);
  }

  @Get()
  findAll(): Promise<Workspace[]> {
    return this.workspaceService.findAll();
  }

  @Get('me')
  findMyWorkspaces(@CurrentUser() user: UserClaims): Promise<Workspace[]> {
    return this.workspaceService.findAll(user.id);
  }

  @Get(':workspaceId')
  findOne(@Param('workspaceId') workspaceId: string): Promise<Workspace> {
    return this.workspaceService.findOne(workspaceId);
  }

  @Patch(':workspaceId')
  @Roles(Role.LEADER)
  update(
    @Param('workspaceId') workspaceId: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto
  ): Promise<Workspace> {
    return this.workspaceService.update(workspaceId, updateWorkspaceDto);
  }

  @Delete(':workspaceId')
  @Roles(Role.LEADER)
  remove(
    @Param('workspaceId') workspaceId: string
  ): Promise<void> {
    return this.workspaceService.remove(workspaceId);
  }
}
