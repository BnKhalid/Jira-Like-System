import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Workspace } from './workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { UserClaims } from '../../auth/interfaces/user-claims.interface';
import { Role } from '../../common/enums/role.enum';

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
          role: Role.LEADER,
        },
      ],
      ...createWorkspaceDto,
    });

    await this.em.persistAndFlush(workspace);

    return workspace;
  }

  async findAll(userId?: string): Promise<Workspace[]> {
    const criteria = userId ? { workspaceMembers: { user: { id: userId } } } : {};

    return this.workspaceRepository.find(
      criteria,
      { populate: ['workspaceMembers', 'tasks', 'sprints'] }
    );
  }

  async findOne(workspaceId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne(
      { id: workspaceId },
      { populate: ['workspaceMembers', 'tasks', 'sprints'] },
    );

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    return workspace;
  }

  async update(
    workspaceId: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<Workspace> {
    const workspace = await this.findOne(workspaceId);

    this.workspaceRepository.assign(workspace, updateWorkspaceDto);

    await this.em.persistAndFlush(workspace);

    return workspace;
  }

  async remove(workspaceId: string): Promise<void> {
    const workspace = await this.findOne(workspaceId);

    await this.em.removeAndFlush(workspace);
  }
}
