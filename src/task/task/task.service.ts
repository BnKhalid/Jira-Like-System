import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Task } from './task.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { WorkspaceService } from '../../workspace/worksapce/workspace.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.entity';
import { TaskTypeEnum } from '../../common/enums/task-type.enum';
import { TaskFilters } from './task-filters.interface';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: EntityRepository<Task>,
    private em: EntityManager,
    private workspaceService: WorkspaceService,
    private userService: UserService,
  ) {}

  async create(
    workspaceId: string,
    createTaskDto: CreateTaskDto
  ): Promise<Task> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace.workspaceMembers.exists(member => member.user.id === createTaskDto.assigneeId)) {
      throw new ForbiddenException('Assignee is not a member of the workspace');
    }

    let parentTask: Task;
    if (createTaskDto.parentTaskId) {
      parentTask = await this.findOne(workspaceId, createTaskDto.parentTaskId);
    }
    
    let reporter: User;
    if (createTaskDto.reporterId) {
      if (!workspace.workspaceMembers.exists(member => member.user.id === createTaskDto.reporterId)) {
        throw new ForbiddenException(
          'Reporter is not a member of the workspace',
        );
      }
      reporter = await this.userService.findOne(createTaskDto.reporterId);
    }

    let assignee: User;
    if (createTaskDto.assigneeId) {
      if (!workspace.workspaceMembers.exists(member => member.user.id === createTaskDto.assigneeId)) {
        throw new ForbiddenException(
          'Assignee is not a member of the workspace',
        );
      }
      assignee = await this.userService.findOne(createTaskDto.assigneeId);
    }
    
    const task = this.taskRepository.create({
      workspace,
      parentTask,
      reporter,
      assignee,
      ...createTaskDto,
    });

    this.validateParentTask(task, task.parentTask);
    
    await this.em.persistAndFlush(task);
    
    return task;
  }

  async findAll(
    workspaceId: string,
    filters: TaskFilters,
  ): Promise<Task[]> {
    const criteria: any = { workspace: { id: workspaceId } };

    if (filters.status) {
      criteria.status = filters.status;
    }

    if (filters.type) {
      criteria.type = filters.type;
    }

    if (filters.parentTaskId) {
      criteria.parentTask = { id: filters.parentTaskId };
    }

    if (filters.assigneeId) {
      criteria.assignee = { id: filters.assigneeId };
    }

    if (filters.reporterId) {
      criteria.reporter = { id: filters.reporterId };
    }

    if (filters.labels && filters.labels.length > 0) {
      criteria.labels = { labelContent: { $in: filters.labels } };
    }

    return await this.taskRepository.find(
      criteria,
      { populate: ['assignee', 'labels', 'incomingLinks', 'outgoingLinks'] }
    );
  }

  async findOne(
    workspaceId: string,
    taskId: string
  ): Promise<Task> {
    const task = await this.taskRepository.findOne(
      { id: taskId, workspace: { id: workspaceId } },
      { populate: ['assignee', 'reporter', 'outgoingLinks', 'incomingLinks', 'labels'] }
    );

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${taskId} is not in this workspace`,
      );
    }

    return task;
  }

  async update(
    workspaceId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    const task = await this.findOne(workspaceId, taskId);

    const { assigneeId, reporterId, parentTaskId, ...rest } = updateTaskDto;

    if (updateTaskDto.assigneeId) {
      if (!workspace.workspaceMembers.exists(member => member.user.id === assigneeId)) {
        throw new ForbiddenException('Assignee is not a member of the workspace');
      }
      task.assignee = await this.userService.findOne(updateTaskDto.assigneeId);
    }
    else if (updateTaskDto.assigneeId === null) {
      task.assignee = null;
    }
    
    if (updateTaskDto.reporterId) {
      if (!workspace.workspaceMembers.exists(member => member.user.id === reporterId)) {
        throw new ForbiddenException('Reporter is not a member of the workspace');
      }
      task.reporter = await this.userService.findOne(updateTaskDto.reporterId);
    }
    else if (updateTaskDto.reporterId === null) {
      task.reporter = null;
    }

    if (updateTaskDto.parentTaskId) {
      task.parentTask = await this.findOne(workspaceId, parentTaskId);

      this.validateParentTask(task, task.parentTask);
    }
    else if (updateTaskDto.parentTaskId === null) {
      task.parentTask = null;
    }

    this.taskRepository.assign(task, rest);

    await this.em.flush();

    return task;
  }

  async removeUserRelations(
    workspaceId: string,
    userId: string,
  ): Promise<void> {
    const assignedTasks = await this.taskRepository.find(
      { workspace: { id: workspaceId }, assignee: { id: userId } },
      { populate: ['assignee'] }
    );

    assignedTasks.forEach(task => task.assignee = null);

    const reportedTasks = await this.taskRepository.find(
      { workspace: { id: workspaceId }, reporter: { id: userId } },
      { populate: ['reporter'] }
    );

    reportedTasks.forEach(task => task.reporter = null);

    await this.em.flush();
  }

  async remove(
    workspaceId: string,
    taskId: string,
  ): Promise<void> {
    const task = await this.findOne(workspaceId, taskId);

    const children = await this.taskRepository.find(
      { parentTask: { id: taskId } }
    );

    for (const child of children) {
      child.parentTask = null;

      this.em.remove(child);
    }

    await this.em.removeAndFlush(task);
  }

  private validateParentTask(task: Task, parentTask?: Task): void {
    if (task.id === parentTask?.id) {
      throw new BadRequestException('A task cannot be its own parent task.');
    }

    if (task.type === TaskTypeEnum.EPIC && parentTask) {
      throw new BadRequestException('An Epic task cannot have a parent task.');
    }

    if (task.type !== TaskTypeEnum.EPIC && parentTask?.type === TaskTypeEnum.SUB_TASK) {
      throw new BadRequestException(
        'User Story, Task and Bug types cannot have a Sub Task as a parent task.',
      );
    }

    if (task.type === TaskTypeEnum.SUB_TASK) {
      if (!parentTask) {
        throw new BadRequestException('Sub Task must have a parent task.');
      }

      if (parentTask?.type === TaskTypeEnum.EPIC) {
        throw new BadRequestException(
          'Sub Task types cannot have an Epic type as a parent task.',
        );
      }
    }
  }
}
