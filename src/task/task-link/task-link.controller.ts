import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskLinkService } from './task-link.service'
import { CreateTaskLinkDto } from './dto/create-task-link.dto';
import { UpdateTaskLinkDto } from './dto/update-task-link.dto';
import { TaskLink } from './task-link.entity';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('api/workspaces/:workspaceId/tasks/:taskId/links')
export class TaskLinkController {
  constructor(private taskLinkService: TaskLinkService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Body() createTaskLinkDto: CreateTaskLinkDto
  ): Promise<TaskLink> {
    return this.taskLinkService.create(workspaceId, taskId, createTaskLinkDto);
  }

  @Get()
  @Roles(Role.MEMBER)
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string
  ): Promise<TaskLink[]> {
    return this.taskLinkService.findAll(workspaceId, taskId);
  }

  @Get(':taskLinkId')
  @Roles(Role.MEMBER)
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Param('taskLinkId') taskLinkId: string
  ): Promise<TaskLink> {
    return this.taskLinkService.findOne(workspaceId, taskId, taskLinkId);
  }

  @Patch(':taskLinkId')
  @Roles(Role.ADMIN)
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Param('taskLinkId') taskLinkId: string,
    @Body() updateTaskLinkDto: UpdateTaskLinkDto
  ): Promise<TaskLink> {
    return this.taskLinkService.update(workspaceId, taskId, taskLinkId, updateTaskLinkDto);
  }

  @Delete(':taskLinkId')
  @Roles(Role.ADMIN)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Param('taskLinkId') taskLinkId: string
  ): Promise<void> {
    return this.taskLinkService.remove(workspaceId, taskId, taskLinkId);
  }
}
