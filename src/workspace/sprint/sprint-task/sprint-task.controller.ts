import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SprintTaskService } from './sprint-task.service';
import { CreateSprintTaskDto } from './dto/create-sprint-task.dto';
import { UpdateSprintTaskDto } from './dto/update-sprint-task.dto';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@Controller('api/workspaces/:workspaceId/sprints/:sprintId/sprint-tasks')
export class SprintTaskController {
  constructor(private readonly sprintTaskService: SprintTaskService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Body() createSprintTaskDto: CreateSprintTaskDto
  ) {
    return this.sprintTaskService.create(workspaceId, sprintId, createSprintTaskDto);
  }

  @Get()
  @Roles(Role.MEMBER)
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string
  ) {
    return this.sprintTaskService.findAll(workspaceId, sprintId);
  }

  @Get(':sprintTaskId')
  @Roles(Role.MEMBER)
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Param('sprintTaskId') sprintTaskId: string
  ) {
    return this.sprintTaskService.findOne(workspaceId, sprintId, sprintTaskId);
  }

  @Patch(':sprintTaskId')
  @Roles(Role.ADMIN)
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Param('sprintTaskId') sprintTaskId: string,
    @Body() updateSprintTaskDto: UpdateSprintTaskDto
  ) {
    return this.sprintTaskService.update(workspaceId, sprintId, sprintTaskId, updateSprintTaskDto);
  }

  @Delete(':sprintTaskId')
  @Roles(Role.ADMIN)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Param('sprintTaskId') sprintTaskId: string
  ) {
    return this.sprintTaskService.remove(workspaceId, sprintId, sprintTaskId);
  }
}
