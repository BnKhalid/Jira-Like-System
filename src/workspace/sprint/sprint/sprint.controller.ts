import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SprintService } from './sprint.service'
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Sprint } from './sprint.entity';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@Controller('api/workspaces/:workspaceId/sprints')
export class SprintController {
  constructor(private sprintService: SprintService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Param('workspaceId') workspaceId: string,
    @Body() createSprintDto: CreateSprintDto
  ): Promise<Sprint> {
    return this.sprintService.create(workspaceId, createSprintDto);
  }

  @Get()
  @Roles(Role.MEMBER)
  findAll(
    @Param('workspaceId') workspaceId: string
  ): Promise<Sprint[]> {
    return this.sprintService.findAll(workspaceId);
  }

  @Get(':sprintId')
  @Roles(Role.MEMBER)
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string
  ): Promise<Sprint> {
    return this.sprintService.findOne(workspaceId, sprintId);
  }

  @Patch(':sprintId')
  @Roles(Role.ADMIN)
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Body() updateSprintDto: UpdateSprintDto
  ): Promise<Sprint> {
    return this.sprintService.update(workspaceId, sprintId, updateSprintDto);
  }

  @Delete(':sprintId')
  @Roles(Role.ADMIN)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string
  ): Promise<void> {
    return this.sprintService.remove(workspaceId, sprintId);
  }
}
