import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './label.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserClaims } from '../../auth/interfaces/user-claims.interface';
import { CurrentUser } from '../../auth/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/workspaces/:workspaceId')
export class LabelController {
  constructor(private labelService: LabelService) {}

  @Post('/tasks/:taskId/labels')
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Body() createLabelDto: CreateLabelDto,
    @CurrentUser() user: UserClaims,
  ): Promise<Label> {
    return this.labelService.create(workspaceId, taskId, createLabelDto, user);
  }

  @Get('labels')
  findAll(
    @Param('workspaceId') workspaceId: string,
  ): Promise<Label[]> {
    return this.labelService.findAll(workspaceId);
  }

  @Get('labels/:labelContent')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('labelContent') labelContent: string,
  ): Promise<Label> {
    return this.labelService.findOne(workspaceId, labelContent);
  }

  @Patch('labels/:labelContent')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('labelContent') labelContent: string,
    @Body() updateLabelDto: UpdateLabelDto,
    @CurrentUser() user: UserClaims,
  ): Promise<Label> {
    return this.labelService.update(workspaceId, labelContent, updateLabelDto, user);
  }

  @Delete('/tasks/:taskId/labels/:labelContent')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Param('labelContent') labelContent: string,
    @CurrentUser() user: UserClaims,
  ): Promise<void> {
    return this.labelService.remove(workspaceId, taskId, labelContent, user);
  }
}
