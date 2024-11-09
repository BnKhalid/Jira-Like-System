import { ForbiddenException, Injectable } from '@nestjs/common';
import { BacklogTask } from './backlog-task.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { WorkspaceService } from '../../worksapce/workspace.service';
import { SprintService } from '../sprint/sprint.service';
import { TaskService } from '../../../task/task/task.service';
import { CreateBacklogTaskDto } from './dto/create-backlog-task.dto';
import { UserClaims } from '../../../auth/user-claims.interface';
import { UpdateBacklogTaskDto } from './dto/update-backlog-task.dto';

@Injectable()
export class BacklogTaskService {
  constructor(
    @InjectRepository(BacklogTask)
    private backlogTaskRepository: EntityRepository<BacklogTask>,
    private em: EntityManager,
    private workspaceService: WorkspaceService,
    private sprintService: SprintService,
    private taskService: TaskService
  ) {}

  async create(
    workspaceId: string,
    sprintId: string,
    createBacklogTaskDto: CreateBacklogTaskDto,
    user: UserClaims
  ): Promise<BacklogTask> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException('You do not have permission to create a backlog task');
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
      throw new ForbiddenException(
        `Backlog task with id ${backlogId} does not exist in sprint with id ${sprintId} in workspace with id ${workspaceId}`
      );
    }

    return backlogTask;
  }

  async update(
    workspaceId: string,
    sprintId: string,
    backlogId: string,
    updateBacklogTaskDto: UpdateBacklogTaskDto,
    user: UserClaims
  ): Promise<BacklogTask> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException('You do not have permission to update a backlog task');
    }

    const backlogTask = await this.findOne(workspaceId, sprintId, backlogId);

    this.backlogTaskRepository.assign(backlogTask, updateBacklogTaskDto);

    await this.em.flush();

    return backlogTask;
  }

  async remove(
    workspaceId: string,
    sprintId: string,
    backlogId: string,
    user: UserClaims
  ): Promise<void> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException('You do not have permission to remove a backlog task');
    }

    const backlogTask = await this.findOne(workspaceId, sprintId, backlogId);

    await this.em.removeAndFlush(backlogTask);
  }
}
