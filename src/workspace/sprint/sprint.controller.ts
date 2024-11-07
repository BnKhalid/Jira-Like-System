import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { SprintService } from './sprint.service'
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Sprint } from './sprint.entity';
import { CurrentUser } from '../../auth/decorators/get-user.decorator';
import { UserClaims } from '../../auth/user-claims.interface';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/workspaces/:workspaceId')
export class SprintController {
  constructor(private sprintService: SprintService) {}

  @Post('sprints')
  create(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Body() createSprintDto: CreateSprintDto,
    @CurrentUser() user: UserClaims
  ): Promise<Sprint> {
    return this.sprintService.create(workspaceId, createSprintDto, user);
  }

  @Get('sprints')
  findAll(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string
  ): Promise<Sprint[]> {
    return this.sprintService.findAll(workspaceId);
  }

  @Get('sprints/:sprintId')
  findOne(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('sprintId', new ParseUUIDPipe({ version: '4' })) sprintId: string
  ): Promise<Sprint> {
    return this.sprintService.findOne(workspaceId, sprintId);
  }

  @Patch('sprints/:sprintId')
  update(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('sprintId', new ParseUUIDPipe({ version: '4' })) sprintId: string,
    @Body() updateSprintDto: UpdateSprintDto,
    @CurrentUser() user: UserClaims
  ): Promise<Sprint> {
    return this.sprintService.update(workspaceId, sprintId, updateSprintDto, user);
  }

  @Delete('sprints/:sprintId')
  remove(
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' })) workspaceId: string,
    @Param('sprintId', new ParseUUIDPipe({ version: '4' })) sprintId: string,
    @CurrentUser() user: UserClaims
  ): Promise<void> {
    return this.sprintService.remove(workspaceId, sprintId, user);
  }
}
