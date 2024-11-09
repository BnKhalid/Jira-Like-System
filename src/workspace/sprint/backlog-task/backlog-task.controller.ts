import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { BacklogTaskService } from './backlog-task.service';
import { CreateBacklogTaskDto } from './dto/create-backlog-task.dto';
import { UpdateBacklogTaskDto } from './dto/update-backlog-task.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { CurrentUser } from '../../../auth/decorators/get-user.decorator';
import { UserClaims } from '../../../auth/user-claims.interface';

@UseGuards(JwtAuthGuard)
@Controller('api/workspaces/:workspaceId/sprints/:sprintId/backlog-tasks')
export class BacklogTaskController {
  constructor(private readonly backlogTaskService: BacklogTaskService) {}

  @Post()
  create(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('sprintId', new ParseUUIDPipe({ version: '4' })) sprintId: string,
    @Body() createBacklogTaskDto: CreateBacklogTaskDto,
    @CurrentUser() user: UserClaims
  ) {
    return this.backlogTaskService.create(workspaceId, sprintId, createBacklogTaskDto, user);
  }

  @Get()
  findAll(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('sprintId', new ParseUUIDPipe({ version: '4' })) sprintId: string
  ) {
    return this.backlogTaskService.findAll(workspaceId, sprintId);
  }

  @Get(':backlogId')
  findOne(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('sprintId', new ParseUUIDPipe({ version: '4' })) sprintId: string,
    @Param('backlogId', new ParseUUIDPipe({ version: '4' })) backlogId: string
  ) {
    return this.backlogTaskService.findOne(workspaceId, sprintId, backlogId);
  }

  @Patch(':backlogId')
  update(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('sprintId', new ParseUUIDPipe({ version: '4' })) sprintId: string,
    @Param('backlogId', new ParseUUIDPipe({ version: '4' })) backlogId: string,
    @Body() updateBacklogTaskDto: UpdateBacklogTaskDto,
    @CurrentUser() user: UserClaims
  ) {
    return this.backlogTaskService.update(workspaceId, sprintId, backlogId, updateBacklogTaskDto, user);
  }

  @Delete(':backlogId')
  remove(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('sprintId', new ParseUUIDPipe({ version: '4' })) sprintId: string,
    @Param('backlogId', new ParseUUIDPipe({ version: '4' })) backlogId: string,
    @CurrentUser() user: UserClaims
  ) {
    return this.backlogTaskService.remove(workspaceId, sprintId, backlogId, user);
  }
}
