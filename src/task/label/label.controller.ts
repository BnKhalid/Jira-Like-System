import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './label.entity';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('api/workspaces/:workspaceId')
export class LabelController {
  constructor(private labelService: LabelService) {}

  @Post('/tasks/:taskId/labels')
  @Roles(Role.ADMIN)
  create(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Body() createLabelDto: CreateLabelDto,
  ): Promise<Label> {
    return this.labelService.create(workspaceId, taskId, createLabelDto);
  }

  @Get('labels')
  @Roles(Role.MEMBER)
  findAll(
    @Param('workspaceId') workspaceId: string,
  ): Promise<Label[]> {
    return this.labelService.findAll(workspaceId);
  }

  @Get('labels/:labelContent')
  @Roles(Role.MEMBER)
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('labelContent') labelContent: string,
  ): Promise<Label> {
    return this.labelService.findOne(workspaceId, labelContent);
  }

  @Patch('labels/:labelContent')
  @Roles(Role.ADMIN)
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('labelContent') labelContent: string,
    @Body() updateLabelDto: UpdateLabelDto
  ): Promise<Label> {
    return this.labelService.update(workspaceId, labelContent, updateLabelDto);
  }

  @Delete('/tasks/:taskId/labels/:labelContent')
  @Roles(Role.ADMIN)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId') taskId: string,
    @Param('labelContent') labelContent: string
  ): Promise<void> {
    return this.labelService.remove(workspaceId, taskId, labelContent);
  }
}
