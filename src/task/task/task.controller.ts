import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/get-user.decorator';
import { UserClaims } from '../../auth/user-claims.interface';
import { Task } from './task.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/workspaces/:workspaceId/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: UserClaims
  ): Promise<Task> {
    return this.taskService.create(workspaceId, createTaskDto, user);
  }

  @Get()
  findAll(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string
  ): Promise<Task[]> {
    return this.taskService.findAll(workspaceId);
  }

  @Get(':taskId')
  findOne(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string
  ): Promise<Task> {
    return this.taskService.findOne(workspaceId, taskId);
  }

  @Patch(':taskId')
  update(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: UserClaims
  ): Promise<Task> {
    return this.taskService.update(workspaceId, taskId, updateTaskDto, user);
  }

  @Delete(':taskId')
  remove(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @CurrentUser() user: UserClaims
  ): Promise<void> {
    return this.taskService.remove(workspaceId, taskId, user);
  }
}
