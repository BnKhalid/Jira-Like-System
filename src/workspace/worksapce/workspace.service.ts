import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Workspace } from './workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { UserClaims } from '../../auth/user-claims.interface';
import { WorkspaceMemberRoleEnum } from '../../common/enums/workspace-member-role.enum';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: EntityRepository<Workspace>,
    private em: EntityManager,
  ) {}

  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    user: UserClaims,
  ): Promise<Workspace> {
    const workspace = this.workspaceRepository.create({
      workspaceMembers: [
        {
          user,
          role: WorkspaceMemberRoleEnum.LEADER,
        },
      ],
      ...createWorkspaceDto,
    });

    await this.em.persistAndFlush(workspace);

    return workspace;
  }

  async findAll(userId?: string): Promise<Workspace[]> {
    if (userId) {
      return await this.workspaceRepository.find(
        { workspaceMembers: { user: userId } },
        { populate: ['workspaceMembers', 'tasks', 'sprints'] },
      );
    }

    return await this.workspaceRepository.findAll({ populate: ['workspaceMembers', 'tasks', 'sprints'] });
  }

  async findOne(id: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne(
      { id },
      { populate: ['workspaceMembers', 'tasks', 'sprints'] },
    );

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    return workspace;
  }

  async update(
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
    user: UserClaims,
  ): Promise<Workspace> {
    const workspace = await this.findOne(id);

    if (!workspace.hasLeaderPermission(user.id)) {
      throw new ForbiddenException(
        'You are not authorized to update this workspace',
      );
    }

    this.workspaceRepository.assign(workspace, updateWorkspaceDto);
    await this.em.persistAndFlush(workspace);
    return workspace;
  }

  async remove(id: string, user: UserClaims): Promise<void> {
    const workspace = await this.findOne(id);

    if (!workspace.hasLeaderPermission(user.id)) {
      throw new ForbiddenException(
        'You are not authorized to delete this workspace',
      );
    }

    await this.em.removeAndFlush(workspace);
  }
}
