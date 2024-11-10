import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BacklogTask } from './backlog-task.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { SprintService } from '../sprint/sprint.service';
import { TaskService } from '../../../task/task/task.service';
import { CreateBacklogTaskDto } from './dto/create-backlog-task.dto';
import { UpdateBacklogTaskDto } from './dto/update-backlog-task.dto';

@Injectable()
export class BacklogTaskService {
  constructor(
    @InjectRepository(BacklogTask)
    private backlogTaskRepository: EntityRepository<BacklogTask>,
    private em: EntityManager,
    private sprintService: SprintService,
    private taskService: TaskService
  ) {}

  async create(
    workspaceId: string,
    sprintId: string,
    createBacklogTaskDto: CreateBacklogTaskDto
  ): Promise<BacklogTask> {
    const excistedBacklogTask = await this.backlogTaskRepository.findOne(
      {
        task: { id: createBacklogTaskDto.taskId },
        sprint: { id: sprintId, workspace: { id: workspaceId } }
      }
    );

    if (excistedBacklogTask) {
      throw new BadRequestException(
        `Task with id ${createBacklogTaskDto.taskId} already exists in sprint with id ${sprintId} in workspace with id ${workspaceId}`
      );
    }

    const sprint = await this.sprintService.findOne(workspaceId, sprintId);

    const task = await this.taskService.findOne(workspaceId, createBacklogTaskDto.taskId);

    const backlogTask = this.backlogTaskRepository.create({
      sprint,
      task,
      ...createBacklogTaskDto
    });
    
    await this.em.persistAndFlush(backlogTask);

    return backlogTask;
  }

  async findAll(
    workspaceId: string,
    sprintId: string
  ): Promise<BacklogTask[]> {
    return await this.backlogTaskRepository.find(
      { sprint: { id: sprintId, workspace: { id: workspaceId } } },
      { populate: ['task', 'sprint'] }
    );
  }

  async findOne(
    workspaceId: string,
    sprintId: string,
    backlogId: string
  ): Promise<BacklogTask> {
    const backlogTask = await this.backlogTaskRepository.findOne(
      { id: backlogId, sprint: { id: sprintId, workspace: { id: workspaceId } } },
      { populate: ['task', 'sprint'] }
    );

    if (!backlogTask) {
      throw new NotFoundException(
        `Backlog task with id ${backlogId} does not exist in sprint with id ${sprintId} in workspace with id ${workspaceId}`
      );
    }

    return backlogTask;
  }

  async update(
    workspaceId: string,
    sprintId: string,
    backlogId: string,
    updateBacklogTaskDto: UpdateBacklogTaskDto
  ): Promise<BacklogTask> {
    const backlogTask = await this.findOne(workspaceId, sprintId, backlogId);

    this.backlogTaskRepository.assign(backlogTask, updateBacklogTaskDto);

    await this.em.flush();

    return backlogTask;
  }

  async remove(
    workspaceId: string,
    sprintId: string,
    backlogId: string
  ): Promise<void> {
    const backlogTask = await this.findOne(workspaceId, sprintId, backlogId);

    await this.em.removeAndFlush(backlogTask);
  }
}
