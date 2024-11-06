import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Workspace } from './workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { UserClaims } from '../auth/user-claims.interface';
import { WorkspaceMemberRoleEnum } from '../common/enums/workspace-member-role.enum';

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
      ...createWorkspaceDto,
      workspaceMembers: [
        {
          user: { ...user },
          role: WorkspaceMemberRoleEnum.LEADER,
        },
      ],
    });

    await this.em.persistAndFlush(workspace);

    return workspace;
  }

  findAll(userId?: string): Promise<Workspace[]> {
    if (userId) {
      return this.workspaceRepository.find(
        { workspaceMembers: { user: userId } },
        { populate: ['workspaceMembers'] },
      );
    }

    return this.workspaceRepository.findAll({ populate: ['workspaceMembers'] });
  }

  async findOne(id: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne(
      { id },
      { populate: ['workspaceMembers', 'tasks'] },
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
      throw new UnauthorizedException(
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
      throw new UnauthorizedException(
        'You are not authorized to delete this workspace',
      );
    }

    await this.em.removeAndFlush(workspace);
  }
}
