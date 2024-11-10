import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BacklogTaskService } from './backlog-task.service';
import { CreateBacklogTaskDto } from './dto/create-backlog-task.dto';
import { UpdateBacklogTaskDto } from './dto/update-backlog-task.dto';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@Controller('api/workspaces/:workspaceId/sprints/:sprintId/backlog-tasks')
export class BacklogTaskController {
  constructor(private readonly backlogTaskService: BacklogTaskService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Body() createBacklogTaskDto: CreateBacklogTaskDto
  ) {
    return this.backlogTaskService.create(workspaceId, sprintId, createBacklogTaskDto);
  }

  @Get()
  @Roles(Role.MEMBER)
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string
  ) {
    return this.backlogTaskService.findAll(workspaceId, sprintId);
  }

  @Get(':backlogId')
  @Roles(Role.MEMBER)
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Param('backlogId') backlogId: string
  ) {
    return this.backlogTaskService.findOne(workspaceId, sprintId, backlogId);
  }

  @Patch(':backlogId')
  @Roles(Role.ADMIN)
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Param('backlogId') backlogId: string,
    @Body() updateBacklogTaskDto: UpdateBacklogTaskDto
  ) {
    return this.backlogTaskService.update(workspaceId, sprintId, backlogId, updateBacklogTaskDto);
  }

  @Delete(':backlogId')
  @Roles(Role.ADMIN)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Param('backlogId') backlogId: string
  ) {
    return this.backlogTaskService.remove(workspaceId, sprintId, backlogId);
  }
}
