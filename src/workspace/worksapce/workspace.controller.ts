import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from './workspace.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { CurrentUser } from '../../auth/decorators/get-user.decorator';
import { UserClaims } from '../../auth/interfaces/user-claims.interface';

@UseGuards(JwtAuthGuard)
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
  findAll(@Req() req: Request): Promise<Workspace[]> {
    return this.workspaceService.findAll();
  }

  @Get('me')
  findMyWorkspaces(@CurrentUser() user: UserClaims): Promise<Workspace[]> {
    return this.workspaceService.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ): Promise<Workspace> {
    return this.workspaceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @CurrentUser() user: UserClaims,
  ): Promise<Workspace> {
    return this.workspaceService.update(id, updateWorkspaceDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserClaims,
  ): Promise<void> {
    return this.workspaceService.remove(id, user);
  }
}
