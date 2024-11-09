import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Task } from './task.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { UserClaims } from '../../auth/interfaces/user-claims.interface';
import { WorkspaceService } from '../../workspace/worksapce/workspace.service';
import { UserService } from '../../user/user.service';
import { TaskStatusEnum } from '../../common/enums/task-status.enum';
import { User } from '../../user/user.entity';

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
    createTaskDto: CreateTaskDto,
    user: UserClaims
  ): Promise<Task> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException(
        'You do not have permission to add members to this workspace',
      );
    }

    if (!workspace.hasMemberPermission(createTaskDto.assigneeId)) {
      throw new ForbiddenException('Assignee is not a member of the workspace');
    }

    let parentTask: Task;
    if (createTaskDto.parentTaskId) {
      parentTask = await this.findOne(workspaceId, createTaskDto.parentTaskId);
    }
    
    let reporter: User;
    if (createTaskDto.reporterId) {
      if (!workspace.hasMemberPermission(createTaskDto.reporterId)) {
        throw new ForbiddenException(
          'Reporter is not a member of the workspace',
        );
      }
      reporter = await this.userService.findOne(createTaskDto.reporterId);
    }

    const assignee = await this.userService.findOne(createTaskDto.assigneeId);
    
    const task = this.taskRepository.create({
      workspace,
      parentTask,
      reporter,
      assignee,
      ...createTaskDto,
    });
    
    await this.em.persistAndFlush(task);
    
    return task;
  }

  async findAll(workspaceId: string): Promise<Task[]> {
    return await this.taskRepository.find(
      { workspace: { id: workspaceId } },
      { populate: ['assignee', 'labels', 'incomingLinks', 'outgoingLinks', 'labels'] }
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
    updateTaskDto: UpdateTaskDto,
    user: UserClaims
  ): Promise<Task> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException(
        'You do not have permission to add members to this workspace'
      );
    }

    const task = await this.findOne(workspaceId, taskId);

    task.type = updateTaskDto.type;
    task.status = updateTaskDto.status ?? TaskStatusEnum.TO_DO;
    task.summary = updateTaskDto.summary;
    task.description = updateTaskDto.description;

    if (!workspace.hasMemberPermission(updateTaskDto.assigneeId)) {
      throw new ForbiddenException('Assignee is not a member of the workspace');
    }
    task.assignee = await this.userService.findOne(updateTaskDto.assigneeId);
    
    if (updateTaskDto.reporterId) {
      if (!workspace.hasMemberPermission(updateTaskDto.reporterId)) {
        throw new ForbiddenException('Reporter is not a member of the workspace');
      }

      task.reporter = await this.userService.findOne(updateTaskDto.reporterId);
    }
    else if (updateTaskDto.reporterId === null) {
      task.reporter = null;
    }

    if (updateTaskDto.parentTaskId) {
      task.parentTask = await this.findOne(workspaceId, updateTaskDto.parentTaskId);
    }
    else if (updateTaskDto.parentTaskId === null) {
      task.parentTask = null;
    }

    await this.em.flush();

    return task;
  }

  async remove(
    workspaceId: string,
    taskId: string,
    user: UserClaims
  ): Promise<void> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException(
        'You do not have permission to add members to this workspace',
      );
    }

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
}
