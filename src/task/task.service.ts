import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Task } from './task.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { UserClaims } from '../auth/user-claims.interface';
import { WorkspaceService } from '../workspace/workspace.service';
import { UserService } from '../user/user.service';
import { TaskStatusEnum } from '../common/enums/task-status.enum';

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

    const task = new Task();

    task.type = createTaskDto.type;
    task.status = createTaskDto.status;
    task.summary = createTaskDto.summary;
    task.description = createTaskDto.description;
    task.workspace = workspace;
    task.assignee = await this.userService.findOne(createTaskDto.assigneeId);
    if (createTaskDto.reporterId) {
      task.reporter = await this.userService.findOne(createTaskDto.reporterId);
    }
    
    this.em.persistAndFlush(task);
    
    return task;
  }

  findAll(workspaceId: string): Promise<Task[]> {
    return this.taskRepository.find(
      { workspace: { id: workspaceId } },
      { populate: ['assignee'] }
    );
  }

  async findOne(
    workspaceId: string,
    taskId: string
  ): Promise<Task> {
    const task = await this.taskRepository.findOne(
      { id: taskId, workspace: { id: workspaceId } },
      { populate: ['assignee', 'outgoingLinks', 'incomingLinks'] }
    );

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${taskId} is not a member of the workspace`,
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
    task.assignee = await this.userService.findOne(updateTaskDto.assigneeId);
    if (updateTaskDto.reporterId) {
      task.reporter = await this.userService.findOne(updateTaskDto.reporterId);
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

    await this.em.removeAndFlush(task);
  }
}
