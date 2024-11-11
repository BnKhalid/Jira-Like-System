import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { WorkspaceMember } from './workspace-member.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserClaims } from '../../auth/interfaces/user-claims.interface';
import { Role } from '../../common/enums/role.enum';
import { WorkspaceService } from '../workspace/workspace.service';
import { UserService } from '../../user/user.service';
import { TaskService } from '../../task/task/task.service';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: EntityRepository<WorkspaceMember>,
    private em: EntityManager,
    private userService: UserService,
    private workspaceService: WorkspaceService,
    private taskService: TaskService,
  ) {}

  async create(
    workspaceId: string,
    createWorkspaceMemberDto: CreateWorkspaceMemberDto
  ): Promise<WorkspaceMember> {
    const workspace = await this.workspaceService.findOne(workspaceId);
    
    if (workspace.workspaceMembers.exists(member => member.user.id === createWorkspaceMemberDto.UserId)) {
      throw new ForbiddenException('User is already a member of the workspace');
    }

    const addedUser = await this.userService.findOne(createWorkspaceMemberDto.UserId);

    const workspaceMember = this.workspaceMemberRepository.create({
      role: createWorkspaceMemberDto.role ?? Role.MEMBER,
      user: addedUser,
      workspace,
    });

    await this.em.persistAndFlush(workspaceMember);

    return workspaceMember;
  }

  async findAll(workspaceId: string): Promise<WorkspaceMember[]> {
    return await this.workspaceMemberRepository.find(
      { workspace: { id: workspaceId } },
      { populate: ['user'] },
    );
  }

  async findOne(workspaceId: string, userId: string): Promise<WorkspaceMember> {
    const workspaceMember = await this.workspaceMemberRepository.findOne(
      {
        workspace: { id: workspaceId },
        user: { id: userId },
      },
      { populate: ['workspace', 'user'] },
    );

    if (!workspaceMember) {
      throw new NotFoundException(
        `User with ID ${userId} is not a member of the workspace`,
      );
    }

    return workspaceMember;
  }

  async update(
    workspaceId: string,
    userId: string,
    updateWorkspaceMemberDto: UpdateWorkspaceMemberDto
  ): Promise<WorkspaceMember> {
    const workspaceMember = await this.findOne(workspaceId, userId);

    if (workspaceMember.role === Role.LEADER) {
      throw new BadRequestException('Cannot update the role of a leader');
    }

    if (updateWorkspaceMemberDto.role === Role.LEADER) {
      throw new BadRequestException('Cannot change workspace leader');
    }

    workspaceMember.role = updateWorkspaceMemberDto.role ?? workspaceMember.role;

    await this.em.persistAndFlush(workspaceMember);

    return workspaceMember;
  }

  async remove(
    workspaceId: string,
    userId: string,
    user: UserClaims,
  ): Promise<void> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    const workspaceMember = await this.findOne(workspaceId, userId);

    if (userId === user.id) { // User is leaving the workspace
      if (user.roles.get(workspaceId) === Role.LEADER) {
        this.workspaceService.remove(workspaceId);
      }
      else {
        await this.em.removeAndFlush(workspaceMember);
      }
    }
    else { // Admin is removing a user
      if (workspaceMember.role === Role.LEADER) {
        throw new BadRequestException('Cannot remove the leader of the workspace');
      }
      else {
        await this.em.removeAndFlush(workspaceMember);
      }
    }
    
    await this.taskService.removeUserRelations(workspaceId, userId);
  }

  async getRoles(userId: string): Promise<Map<string, Role>> {
    const workspaceMembers = await this.workspaceMemberRepository.find(
      { user: { id: userId } },
      { populate: ['workspace'] },
    );

    return workspaceMembers.reduce((acc, curr) => {
      acc.set(curr.workspace.id, curr.role);
      return acc;
    }, new Map<string, Role>());
  }
}
