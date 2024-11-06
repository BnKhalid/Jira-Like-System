import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { UpdateWorkspaceMemberDto } from './dto/update-workspace-member.dto';
import { WorkspaceMember } from './workspace-member.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserClaims } from '../../auth/user-claims.interface';
import { WorkspaceMemberRoleEnum } from '../../common/enums/workspace-member-role.enum';
import { WorkspaceService } from '../workspace.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: EntityRepository<WorkspaceMember>,
    private em: EntityManager,
    private userService: UserService,
    private workspaceService: WorkspaceService,
  ) {}

  async create(
    workspaceId: string,
    memberId: string,
    createWorkspaceMemberDto: CreateWorkspaceMemberDto,
    user: UserClaims,
  ): Promise<WorkspaceMember> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException(
        'You do not have permission to add members to this workspace',
      );
    }
    
    if (workspace.hasMemberPermission(memberId)) {
      throw new ForbiddenException('User is already a member of the workspace');
    }

    const addedUser = await this.userService.findOne(memberId);

    const workspaceMember = this.em.create(WorkspaceMember, {
      role: createWorkspaceMemberDto.role ?? WorkspaceMemberRoleEnum.MEMBER,
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
    updateWorkspaceMemberDto: UpdateWorkspaceMemberDto,
    user: UserClaims,
  ): Promise<WorkspaceMember> {
    const workspace = await this.workspaceService.findOne(workspaceId);

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException(
        'You do not have permission to update members in this workspace',
      );
    }

    const workspaceMember = await this.findOne(workspaceId, userId);

    if (workspaceMember.role === WorkspaceMemberRoleEnum.LEADER) {
      throw new ForbiddenException('Cannot update the role of a leader');
    }

    if (updateWorkspaceMemberDto.role === WorkspaceMemberRoleEnum.LEADER) {
      throw new ForbiddenException('Cannot change workspace leader');
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

    if (userId === user.id) {
      if (workspace.hasLeaderPermission(user.id)) {
        this.workspaceService.remove(workspaceId, user);
      }
      else {
        this.em.removeAndFlush(workspaceMember);
      }
      return;
    }

    if (!workspace.hasAdminPermission(user.id)) {
      throw new ForbiddenException(
        'You do not have permission to remove members from this workspace',
      );
    }

    if (workspaceMember.role === WorkspaceMemberRoleEnum.LEADER) {
      throw new ForbiddenException('Cannot remove the leader of the workspace');
    }
    else {
      await this.em.removeAndFlush(workspaceMember);
    }
  }
}
