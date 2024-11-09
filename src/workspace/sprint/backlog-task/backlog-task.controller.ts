import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BacklogTaskService } from './backlog-task.service';
import { CreateBacklogTaskDto } from './dto/create-backlog-task.dto';
import { UpdateBacklogTaskDto } from './dto/update-backlog-task.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/decorators/get-user.decorator';
import { UserClaims } from '../../../auth/interfaces/user-claims.interface';

@UseGuards(JwtAuthGuard)
@Controller('api/workspaces/:workspaceId/sprints/:sprintId/backlog-tasks')
export class BacklogTaskController {
  constructor(private readonly backlogTaskService: BacklogTaskService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Body() createBacklogTaskDto: CreateBacklogTaskDto,
    @CurrentUser() user: UserClaims
  ) {
    return this.backlogTaskService.create(workspaceId, sprintId, createBacklogTaskDto, user);
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string
  ) {
    return this.backlogTaskService.findAll(workspaceId, sprintId);
  }

  @Get(':backlogId')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Param('backlogId') backlogId: string
  ) {
    return this.backlogTaskService.findOne(workspaceId, sprintId, backlogId);
  }

  @Patch(':backlogId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Param('backlogId') backlogId: string,
    @Body() updateBacklogTaskDto: UpdateBacklogTaskDto,
    @CurrentUser() user: UserClaims
  ) {
    return this.backlogTaskService.update(workspaceId, sprintId, backlogId, updateBacklogTaskDto, user);
  }

  @Delete(':backlogId')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Param('backlogId') backlogId: string,
    @CurrentUser() user: UserClaims
  ) {
    return this.backlogTaskService.remove(workspaceId, sprintId, backlogId, user);
  }
}
