import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './label.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { TaskService } from '../task/task.service';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: EntityRepository<Label>,
    private em: EntityManager,
    private taskService: TaskService
  ) {}

  async create(
    workspaceId: string,
    taskId: string,
    createLabelDto: CreateLabelDto
  ): Promise<Label> {
    const task = await this.taskService.findOne(workspaceId, taskId);

    const existingLabel = task.labels.getItems().find(label => label.labelContent === createLabelDto.labelContent);

    if (existingLabel) {
      throw new BadRequestException('Label already exists for this task');
    }

    let label = await this.tryGetLabel(workspaceId, createLabelDto.labelContent);
    
    task.labels.add(label);

    await this.em.flush();

    return label;
  }

  async findAll(
    workspaceId: string
  ): Promise<Label[]> {
    return await this.labelRepository.find(
      { tasks: { workspace: { id: workspaceId } } },
      { populate: ['tasks'] }
    );
  }

  async findOne(
    workspaceId: string,
    labelContent: string
  ): Promise<Label> {
    const label = await this.labelRepository.findOne(
      { labelContent, tasks: { workspace: { id: workspaceId } } },
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
    updateLabelDto: UpdateLabelDto
  ): Promise<Label> {
    const existingLabel = await this.labelRepository.findOne(
      { labelContent: updateLabelDto.labelContent, tasks: { workspace: { id: workspaceId } } }
    );

    if (existingLabel) {
      throw new BadRequestException('Label already exists');
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
  ): Promise<void> {
    const task = await this.taskService.findOne(workspaceId, taskId);

    const label = await this.findOne(workspaceId, labelContent);

    task.labels.remove(label);

    await this.em.flush();
  }

  private async tryGetLabel(workspaceId: string, labelContent: string): Promise<Label> {
    let label: Label;
    
    label = await this.labelRepository.findOne(
      { labelContent, tasks: { workspace: { id: workspaceId } } },
      { populate: ['tasks'] },
    );
    
    if (!label) {
      label = this.labelRepository.create({ labelContent });
    }

    return label;
  }
}
