import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseArrayPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import { TaskStatusEnum } from '../../common/enums/task-status.enum';
import { TaskTypeEnum } from '../../common/enums/task-type.enum';

@Controller('api/workspaces/:workspaceId/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Param('workspaceId') workspaceId: string,
    @Body() createTaskDto: CreateTaskDto
  ): Promise<Task> {
    return this.taskService.create(workspaceId, createTaskDto);
  }

  @Get()
  @Roles(Role.MEMBER)
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Query('status') status?: TaskStatusEnum,
    @Query('type') type?: TaskTypeEnum,
    @Query('parentTaskId') parentTaskId?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('reporterId') reporterId?: string,
    @Query('labels',
      new ParseArrayPipe({ items: String, separator: ',', optional: true })
    ) labels?: string[],
  ): Promise<Task[]> {
    return this.taskService.findAll(workspaceId, { status, type, labels, parentTaskId, assigneeId, reporterId });
  }

  @Get(':taskId')
  @Roles(Role.MEMBER)
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string
  ): Promise<Task> {
    return this.taskService.findOne(workspaceId, taskId);
  }

  @Patch(':taskId')
  @Roles(Role.ADMIN)
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    return this.taskService.update(workspaceId, taskId, updateTaskDto);
  }

  @Delete(':taskId')
  @Roles(Role.ADMIN)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string
  ): Promise<void> {
    return this.taskService.remove(workspaceId, taskId);
  }
}
