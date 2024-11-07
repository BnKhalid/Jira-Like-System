import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './label.entity';
import { UserClaims } from '../../auth/user-claims.interface';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { WorkspaceService } from '../../workspace/workspace.service';
import { TaskService } from '../task.service';
import { Workspace } from '../../workspace/workspace.entity';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: EntityRepository<Label>,
    private em: EntityManager,
    private workspaceService: WorkspaceService,
    private taskService: TaskService
  ) {}

  async create(
    workspaceId: string,
    taskId: string,
    createLabelDto: CreateLabelDto,
    user: UserClaims
  ): Promise<Label> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException(
        'You do not have permission to add labels to this workspace',
      );
    }

    const task = await this.taskService.findOne(workspaceId, taskId);

    const existingLabel = task.labels.getItems().find(label => label.labelContent === createLabelDto.labelContent);

    if (existingLabel) {
      throw new ForbiddenException('Label already exists for this task');
    }

    let label = await this.tryGetLabel(workspace, createLabelDto.labelContent);
    
    task.labels.add(label);

    await this.em.flush();

    return label;
  }

  async findAll(
    workspaceId: string
  ): Promise<Label[]> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    return this.labelRepository.find(
      { tasks: { workspace } },
      { populate: ['tasks'] }
    );
  }

  async findOne(
    workspaceId: string,
    labelContent: string
  ): Promise<Label> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    const label = await this.labelRepository.findOne(
      { labelContent, tasks: { workspace } },
      { populate: ['tasks'] }
    );

    if (!label) {
      throw new NotFoundException(`Label ${labelContent} not found`);
    }

    return label;
  }

  async update(
    workspaceId: string,
    labelContent: string,
    updateLabelDto: UpdateLabelDto,
    user: UserClaims
  ): Promise<Label> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException(
        'You do not have permission to update labels in this workspace',
      );
    }

    const existingLabel = await this.labelRepository.findOne(
      { labelContent: updateLabelDto.labelContent, tasks: { workspace } }
    );
    if (existingLabel) {
      throw new ForbiddenException('Label already exists');
    }

    const label = await this.findOne(workspaceId, labelContent);

    label.labelContent = updateLabelDto.labelContent;

    await this.em.flush();

    return label;
  }

  async remove(
    workspaceId: string,
    taskId: string,
    labelContent: string,
    user: UserClaims
  ): Promise<void> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException(
        'You do not have permission to remove labels from this workspace',
      );
    }

    const task = await this.taskService.findOne(workspaceId, taskId);

    const label = await this.findOne(workspaceId, labelContent);

    task.labels.remove(label);

    await this.em.flush();
  }

  private async tryGetLabel(workspace: Workspace, labelContent: string): Promise<Label> {
    let label: Label;
    
    label = await this.labelRepository.findOne(
      { labelContent, tasks: { workspace } },
      { populate: ['tasks'] },
    );
    
    if (!label) {
      label = this.labelRepository.create({ labelContent });
    }

    return label;
  }
}
