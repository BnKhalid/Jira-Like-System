import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { WorkspaceMember } from './workspace-member.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Workspace } from '../workspace.entity';
import { UserClaims } from 'src/auth/user-claims.interface';
import { User } from 'src/user/user.entity';
import { log } from 'console';
import { WorkspaceMemberRoleEnum } from 'src/common/enums/workspace-member-role.enum';
import { WorkspaceService } from '../workspace.service';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    @InjectRepository(Workspace)
    private workspaceRepository: EntityRepository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: EntityRepository<WorkspaceMember>,
    private em: EntityManager,
    private workspaceService: WorkspaceService,
  ) {}

  async create(
    workspaceId: string,
    memberId: string,
    createWorkspaceMemberDto: CreateWorkspaceMemberDto,
    user: UserClaims,
  ): Promise<WorkspaceMember> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with ID ${workspaceId} not found`,
      );
    }

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException(
        'You do not have permission to add members to this workspace',
      );
    }

    const alreadyMember = await this.workspaceMemberRepository.findOne({
      workspace: workspaceId,
      user: { id: memberId },
    });
    if (alreadyMember) {
      throw new ForbiddenException('User is already a member of the workspace');
    }

    const addedUser = await this.userRepository.findOne(memberId);
    if (!addedUser) {
      throw new NotFoundException(`User with ID ${memberId} not found`);
    }

    const workspaceMember = this.em.create(WorkspaceMember, {
      role: createWorkspaceMemberDto.role,
      user: addedUser,
      workspace,
    });

    await this.em.persistAndFlush(workspaceMember);

    return workspaceMember;
  }

  findAll(workspaceId: string): Promise<WorkspaceMember[]> {
    return this.workspaceMemberRepository.find(
      { workspace: { id: workspaceId } },
      { populate: ['user'] },
    );
  }

  findOne(workspaceId: string, userId: string): Promise<WorkspaceMember> {
    return this.workspaceMemberRepository.findOne(
      {
        workspace: { id: workspaceId },
        user: { id: userId },
      },
      { populate: ['workspace', 'user'] },
    );
  }

  async update(
    workspaceId: string,
    userId: string,
    updateWorkspaceMemberDto: UpdateWorkspaceMemberDto,
    user: UserClaims,
  ): Promise<WorkspaceMember> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException(
        'You do not have permission to update members in this workspace',
      );
    }

    const workspaceMember = await this.findOne(workspaceId, userId);

    if (!workspaceMember) {
      throw new NotFoundException(
        `User with ID ${userId} is not a member of the workspace`,
      );
    }

    if (workspaceMember.role === WorkspaceMemberRoleEnum.Leader) {
      throw new ForbiddenException('Cannot update the role of a leader');
    }

    if (updateWorkspaceMemberDto.role === WorkspaceMemberRoleEnum.Leader) {
      throw new ForbiddenException('Cannot change workspace leader');
    }

    workspaceMember.role = updateWorkspaceMemberDto.role;

    await this.em.persistAndFlush(workspaceMember);

    return workspaceMember;
  }

  async remove(
    workspaceId: string,
    userId: string,
    user: UserClaims,
  ): Promise<void> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    const workspaceMember = await this.findOne(workspaceId, userId);

    if (!workspaceMember) {
      throw new NotFoundException(
        `User with ID ${userId} is not a member of the workspace`,
      );
    }

    if (userId === user.id) {
      if (workspace.hasLeaderPermission(user.id)) {
        this.workspaceService.remove(workspaceId, user);
      }
      else {
        this.em.removeAndFlush(workspaceMember);
      }
    }

    else if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException(
        'You do not have permission to remove members from this workspace',
      );
    }

    if (workspaceMember.role === WorkspaceMemberRoleEnum.Leader) {
      throw new ForbiddenException('Cannot remove the leader of the workspace');
    }
    
    else {
      await this.em.removeAndFlush(workspaceMember);
    }
  }
}
