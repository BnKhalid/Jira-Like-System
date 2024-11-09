import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/get-user.decorator';
import { UserClaims } from '../../auth/interfaces/user-claims.interface';
import { Task } from './task.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/workspaces/:workspaceId/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: UserClaims
  ): Promise<Task> {
    return this.taskService.create(workspaceId, createTaskDto, user);
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string
  ): Promise<Task[]> {
    return this.taskService.findAll(workspaceId);
  }

  @Get(':taskId')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string
  ): Promise<Task> {
    return this.taskService.findOne(workspaceId, taskId);
  }

  @Patch(':taskId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: UserClaims
  ): Promise<Task> {
    return this.taskService.update(workspaceId, taskId, updateTaskDto, user);
  }

  @Delete(':taskId')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @CurrentUser() user: UserClaims
  ): Promise<void> {
    return this.taskService.remove(workspaceId, taskId, user);
  }
}
