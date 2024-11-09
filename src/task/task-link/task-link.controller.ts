import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskLinkService } from './task-link.service'
import { CreateTaskLinkDto } from './dto/create-task-link.dto';
import { UpdateTaskLinkDto } from './dto/update-task-link.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TaskLink } from './task-link.entity';
import { CurrentUser } from '../../auth/decorators/get-user.decorator';
import { UserClaims } from '../../auth/interfaces/user-claims.interface';

@UseGuards(JwtAuthGuard)
@Controller('api/workspaces/:workspaceId/tasks/:taskId/links')
export class TaskLinkController {
  constructor(private taskLinkService: TaskLinkService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Body() createTaskLinkDto: CreateTaskLinkDto,
    @CurrentUser() user: UserClaims
  ): Promise<TaskLink> {
    return this.taskLinkService.create(workspaceId, taskId, createTaskLinkDto, user);
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string
  ): Promise<TaskLink[]> {
    return this.taskLinkService.findAll(workspaceId, taskId);
  }

  @Get(':id')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Param('id') id: string
  ): Promise<TaskLink> {
    return this.taskLinkService.findOne(workspaceId, taskId, id);
  }

  @Patch(':id')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Param('id') id: string,
    @Body() updateTaskLinkDto: UpdateTaskLinkDto,
    @CurrentUser() user: UserClaims
  ): Promise<TaskLink> {
    return this.taskLinkService.update(workspaceId, taskId, id, updateTaskLinkDto, user);
  }

  @Delete(':id')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Param('id') id: string,
    @CurrentUser() user: UserClaims
  ): Promise<void> {
    return this.taskLinkService.remove(workspaceId, taskId, id, user);
  }
}
