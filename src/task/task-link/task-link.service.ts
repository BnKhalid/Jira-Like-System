import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskLinkDto } from './dto/create-task-link.dto'
import { UpdateTaskLinkDto } from './dto/update-task-link.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { TaskLink } from './task-link.entity';
import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { TaskService } from '../task/task.service';
import { TaskLinkTypeEnum } from '../../common/enums/task-link-type.enum';

@Injectable()
export class TaskLinkService {
  constructor(
    @InjectRepository(TaskLink)
    private taskLinkRepository: EntityRepository<TaskLink>,
    private em: EntityManager,
    private taskService: TaskService
  ) { }

  async create(
    workspaceId: string,
    taskId: string,
    createTaskLinkDto: CreateTaskLinkDto
  ): Promise<TaskLink> {
    const sourceTask = await this.taskService.findOne(workspaceId, taskId);
    const targetTask = await this.taskService.findOne(workspaceId, createTaskLinkDto.targetTaskId);

    const existingTaskLink = await this.taskLinkRepository.findOne(
      { sourceTask: sourceTask, targetTask: targetTask }
    );

    if (existingTaskLink) {
      throw new BadRequestException(
        `Task link between task ${sourceTask.id} and task ${targetTask.id} already exists`,
      );
    }

    const incomingLink = this.taskLinkRepository.create({
      sourceTask,
      targetTask,
      linkType: createTaskLinkDto.linkType,
    });

    const outgoingLink = this.taskLinkRepository.create({
      sourceTask: targetTask,
      targetTask: sourceTask,
      linkType: this.reverseLinkType(createTaskLinkDto.linkType),
    });

    await this.em.persistAndFlush([incomingLink, outgoingLink]);

    return incomingLink;
  }

  findAll(
    workspaceId: string,
    taskId: string
  ): Promise<TaskLink[]> {
    return this.taskLinkRepository.find(
      { sourceTask: { id: taskId, workspace: { id: workspaceId } } },
      { populate: ['sourceTask'] }
    );
  }

  async findOne(
    workspaceId: string,
    taskId: string,
    sourceTaskLinkId: string
  ): Promise<TaskLink> {
    const taskLink = await this.taskLinkRepository.findOne(
      { id: sourceTaskLinkId, sourceTask: { id: taskId, workspace: { id: workspaceId } } },
      { populate: ['sourceTask'] }
    );

    if (!taskLink) {
      throw new NotFoundException(
        `Task link with ID ${sourceTaskLinkId} does not exist`,
      );
    }

    return taskLink;
  }

  async update(
    workspaceId: string,
    sourceTaskId: string,
    sourceTaskLinkId: string,
    updateTaskLinkDto: UpdateTaskLinkDto
  ): Promise<TaskLink> {
    const taskLink = await this.findOne(workspaceId, sourceTaskId, sourceTaskLinkId);
    const reversedTaskLink = await this.taskLinkRepository.findOne(
      { sourceTask: taskLink.targetTask, targetTask: taskLink.sourceTask }
    );

    const targetTask = await this.taskService.findOne(workspaceId, updateTaskLinkDto.targetTaskId);

    taskLink.targetTask = targetTask;
    taskLink.linkType = updateTaskLinkDto.linkType;
    
    reversedTaskLink.sourceTask = targetTask;
    reversedTaskLink.linkType = this.reverseLinkType(updateTaskLinkDto.linkType);

    const existingTaskLink = await this.taskLinkRepository.findOne(
      { sourceTask: taskLink.sourceTask, targetTask: taskLink.targetTask }
    );

    if (existingTaskLink && existingTaskLink.id !== taskLink.id) {
      throw new ForbiddenException(
        `Task link between task ${taskLink.sourceTask.id} and task ${taskLink.targetTask.id} already exists`,
      );
    }

    await this.em.flush();

    return taskLink;
  }

  async remove(
    workspaceId: string,
    taskId: string,
    sourceTaskLinkId: string
  ): Promise<void> {
    const taskLink = await this.findOne(workspaceId, taskId, sourceTaskLinkId);
    const reversedTaskLink = await this.taskLinkRepository.findOne(
      { sourceTask: taskLink.targetTask, targetTask: taskLink.sourceTask }
    );

    this.em.remove(taskLink);
    this.em.remove(reversedTaskLink);

    await this.em.flush();
  }

  private reverseLinkType(linkType: TaskLinkTypeEnum): TaskLinkTypeEnum {
    switch (linkType) {
      case TaskLinkTypeEnum.BLOCKS:
        return TaskLinkTypeEnum.IS_BLOCKED_BY;
      case TaskLinkTypeEnum.IS_BLOCKED_BY:
        return TaskLinkTypeEnum.BLOCKS;
      case TaskLinkTypeEnum.CLONES:
        return TaskLinkTypeEnum.IS_CLONED_BY;
      case TaskLinkTypeEnum.IS_CLONED_BY:
        return TaskLinkTypeEnum.CLONES;
      case TaskLinkTypeEnum.DUPLICATES:
        return TaskLinkTypeEnum.IS_DUPLICATED_BY;
      case TaskLinkTypeEnum.IS_DUPLICATED_BY:
        return TaskLinkTypeEnum.DUPLICATES;
      default:
        return TaskLinkTypeEnum.RELATES_TO;
    }
  }
}
