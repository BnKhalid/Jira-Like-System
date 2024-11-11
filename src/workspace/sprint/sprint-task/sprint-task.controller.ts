import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseArrayPipe } from '@nestjs/common';
import { SprintTaskService } from './sprint-task.service';
import { CreateSprintTaskDto } from './dto/create-sprint-task.dto';
import { UpdateSprintTaskDto } from './dto/update-sprint-task.dto';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { SprintTask } from './sprint-task.entity';
import { TaskStatusEnum } from '../../../common/enums/task-status.enum';
import { TaskTypeEnum } from '../../../common/enums/task-type.enum';
import { SprintTaskPriorityEnum } from '../../../common/enums/sprint-task-priority.enum';
import { SprintTaskFilters } from './sprint-task.interface';

@Controller('api/workspaces/:workspaceId/sprints/:sprintId/sprint-tasks')
export class SprintTaskController {
  constructor(private readonly sprintTaskService: SprintTaskService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Body() createSprintTaskDto: CreateSprintTaskDto
  ): Promise<SprintTask> {
    return this.sprintTaskService.create(workspaceId, sprintId, createSprintTaskDto);
  }

  @Get()
  @Roles(Role.MEMBER)
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Query('status') status?: TaskStatusEnum,
    @Query('type') type?: TaskTypeEnum,
    @Query('parentTaskId') parentTaskId?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('reporterId') reporterId?: string,
    @Query('priority') priority?: SprintTaskPriorityEnum,
    @Query('storyPointEstimate') storyPointEstimate?: number,
    @Query('labels',
      new ParseArrayPipe({ items: String, separator: ',', optional: true })
    ) labels?: string[],
  ): Promise<SprintTask[]> {
    const filters: SprintTaskFilters = { status, type, labels, parentTaskId, assigneeId, reporterId, priority, storyPointEstimate };
    return this.sprintTaskService.findAll(workspaceId, sprintId, filters);
  }

  @Get(':sprintTaskId')
  @Roles(Role.MEMBER)
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Param('sprintTaskId') sprintTaskId: string
  ): Promise<SprintTask> {
    return this.sprintTaskService.findOne(workspaceId, sprintId, sprintTaskId);
  }

  @Patch(':sprintTaskId')
  @Roles(Role.ADMIN)
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Param('sprintTaskId') sprintTaskId: string,
    @Body() updateSprintTaskDto: UpdateSprintTaskDto
  ): Promise<SprintTask> {
    return this.sprintTaskService.update(workspaceId, sprintId, sprintTaskId, updateSprintTaskDto);
  }

  @Delete(':sprintTaskId')
  @Roles(Role.ADMIN)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Param('sprintTaskId') sprintTaskId: string
  ): Promise<void> {
    return this.sprintTaskService.remove(workspaceId, sprintId, sprintTaskId);
  }
}
