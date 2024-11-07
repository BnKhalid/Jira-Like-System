import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { TaskLinkService } from './task-link.service'
import { CreateTaskLinkDto } from './dto/create-task-link.dto';
import { UpdateTaskLinkDto } from './dto/update-task-link.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TaskLink } from './task-link.entity';
import { CurrentUser } from '../../auth/decorators/get-user.decorator';
import { UserClaims } from '../../auth/user-claims.interface';

@UseGuards(JwtAuthGuard)
@Controller('api/workspaces/:workspaceId/tasks/:taskId/links')
export class TaskLinkController {
  constructor(private taskLinkService: TaskLinkService) {}

  @Post()
  create(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Body() createTaskLinkDto: CreateTaskLinkDto,
    @CurrentUser() user: UserClaims
  ): Promise<TaskLink> {
    return this.taskLinkService.create(workspaceId, taskId, createTaskLinkDto, user);
  }

  @Get()
  findAll(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string
  ): Promise<TaskLink[]> {
    return this.taskLinkService.findAll(workspaceId, taskId);
  }

  @Get(':id')
  findOne(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<TaskLink> {
    return this.taskLinkService.findOne(workspaceId, taskId, id);
  }

  @Patch(':id')
  update(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateTaskLinkDto: UpdateTaskLinkDto,
    @CurrentUser() user: UserClaims
  ): Promise<TaskLink> {
    return this.taskLinkService.update(workspaceId, taskId, id, updateTaskLinkDto, user);
  }

  @Delete(':id')
  remove(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('taskId', new ParseUUIDPipe({ version: '4' })) taskId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: UserClaims
  ): Promise<void> {
    return this.taskLinkService.remove(workspaceId, taskId, id, user);
  }
}
