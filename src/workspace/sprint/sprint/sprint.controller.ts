import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SprintService } from './sprint.service'
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Sprint } from './sprint.entity';
import { CurrentUser } from '../../../auth/decorators/get-user.decorator';
import { UserClaims } from '../../../auth/interfaces/user-claims.interface';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/workspaces/:workspaceId/sprints')
export class SprintController {
  constructor(private sprintService: SprintService) {}

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Body() createSprintDto: CreateSprintDto,
    @CurrentUser() user: UserClaims
  ): Promise<Sprint> {
    return this.sprintService.create(workspaceId, createSprintDto, user);
  }

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string
  ): Promise<Sprint[]> {
    return this.sprintService.findAll(workspaceId);
  }

  @Get(':sprintId')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string
  ): Promise<Sprint> {
    return this.sprintService.findOne(workspaceId, sprintId);
  }

  @Patch(':sprintId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @Body() updateSprintDto: UpdateSprintDto,
    @CurrentUser() user: UserClaims
  ): Promise<Sprint> {
    return this.sprintService.update(workspaceId, sprintId, updateSprintDto, user);
  }

  @Delete(':sprintId')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('sprintId') sprintId: string,
    @CurrentUser() user: UserClaims
  ): Promise<void> {
    return this.sprintService.remove(workspaceId, sprintId, user);
  }
}
