import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SprintTask as SprintTask } from './sprint-task.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { SprintService } from '../sprint/sprint.service';
import { TaskService } from '../../../task/task/task.service';
import { CreateSprintTaskDto } from './dto/create-sprint-task.dto';
import { UpdateSprintTaskDto } from './dto/update-sprint-task.dto';
import { SprintTaskFilters } from './sprint-task.interface';

@Injectable()
export class SprintTaskService {
  constructor(
    @InjectRepository(SprintTask)
    private sprintTaskRepository: EntityRepository<SprintTask>,
    private em: EntityManager,
    private sprintService: SprintService,
    private taskService: TaskService
  ) {}

  async create(
    workspaceId: string,
    sprintId: string,
    createSprintTaskDto: CreateSprintTaskDto
  ): Promise<SprintTask> {
    const excistedSprintTask = await this.sprintTaskRepository.findOne(
      {
        task: { id: createSprintTaskDto.taskId },
        sprint: { id: sprintId, workspace: { id: workspaceId } }
      }
    );

    if (excistedSprintTask) {
      throw new BadRequestException(
        `Task with id ${createSprintTaskDto.taskId} already exists in sprint with id ${sprintId} in workspace with id ${workspaceId}`
      );
    }

    const sprint = await this.sprintService.findOne(workspaceId, sprintId);

    const task = await this.taskService.findOne(workspaceId, createSprintTaskDto.taskId);

    const sprintTask = this.sprintTaskRepository.create({
      sprint,
      task,
      ...createSprintTaskDto
    });
    
    await this.em.persistAndFlush(sprintTask);

    return sprintTask;
  }

  async findAll(
    workspaceId: string,
    sprintId: string,
    filters: SprintTaskFilters
  ): Promise<SprintTask[]> {
    const criteria: any = { sprint: { id: sprintId, workspace: { id: workspaceId } } };

    if (filters.status) {
      criteria.task = { status: filters.status };
    }

    if (filters.type) {
      criteria.task = { type: filters.type };
    }

    if (filters.parentTaskId) {
      criteria.task = { parentTask: { id: filters.parentTaskId } };
    }

    if (filters.assigneeId) {
      criteria.task = { assignee: { id: filters.assigneeId } };
    }

    if (filters.reporterId) {
      criteria.task = { reporter: { id: filters.reporterId } };
    }

    if (filters.labels && filters.labels.length > 0) {
      criteria.task = { labels: { $in: filters.labels } };
    }

    if (filters.priority) {
      criteria.priority = filters.priority;
    }

    if (filters.storyPointEstimate) {
      criteria.storyPointEstimate = filters.storyPointEstimate;
    }

    return await this.sprintTaskRepository.find(
      criteria,
      { populate: ['task', 'sprint'] }
    );
  }

  async findOne(
    workspaceId: string,
    sprintId: string,
    sprintTaskId: string
  ): Promise<SprintTask> {
    const sprintTask = await this.sprintTaskRepository.findOne(
      { id: sprintTaskId, sprint: { id: sprintId, workspace: { id: workspaceId } } },
      { populate: ['task', 'sprint'] }
    );

    if (!sprintTask) {
      throw new NotFoundException(
        `sprint task with id ${sprintTaskId} does not exist in sprint with id ${sprintId} in workspace with id ${workspaceId}`
      );
    }

    return sprintTask;
  }

  async update(
    workspaceId: string,
    sprintId: string,
    sprintTaskId: string,
    updateSprintTaskDto: UpdateSprintTaskDto
  ): Promise<SprintTask> {
    const sprintTask = await this.findOne(workspaceId, sprintId, sprintTaskId);

    this.sprintTaskRepository.assign(sprintTask, updateSprintTaskDto);

    await this.em.flush();

    return sprintTask;
  }

  async remove(
    workspaceId: string,
    sprintId: string,
    sprintTaskId: string
  ): Promise<void> {
    const sprintTask = await this.findOne(workspaceId, sprintId, sprintTaskId);

    await this.em.removeAndFlush(sprintTask);
  }
}
