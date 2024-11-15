import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Sprint } from './sprint.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { WorkspaceService } from '../../workspace/workspace.service';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(Sprint)
    private sprintRepository: EntityRepository<Sprint>,
    private em: EntityManager,
    private workspaceService: WorkspaceService
  ) {}

  async create(
    workspaceId: string,
    createSprintDto: CreateSprintDto
  ): Promise<Sprint> {
    if (createSprintDto.startDate >= createSprintDto.endDate) {
      throw new BadRequestException('End date must be after start date');
    }
    
    const workspace = await this.workspaceService.findOne(workspaceId);
    
    const sprint = this.sprintRepository.create({
      workspace,
      ...createSprintDto
    });

    await this.em.persistAndFlush(sprint);
    
    return sprint;
  }

  async findAll(
    workspaceId: string
  ): Promise<Sprint[]> {
    return await this.sprintRepository.find(
      { workspace: { id: workspaceId } },
      { populate: ['sprintTasks'] }
    );
  }

  async findOne(
    workspaceId: string,
    sprintId: string
  ): Promise<Sprint> {
    const sprint = await this.sprintRepository.findOne(
      { id: sprintId, workspace: { id: workspaceId } },
      { populate: ['sprintTasks'] }
    );

    if (!sprint) {
      throw new NotFoundException(
        `Sprint with id ${sprintId} does not exist in workspace with id ${workspaceId}`
      );
    }

    return sprint;
  }

  async update(
    workspaceId: string,
    sprintId: string,
    updateSprintDto: UpdateSprintDto
  ): Promise<Sprint> {
    if (updateSprintDto.startDate >= updateSprintDto.endDate) {
      throw new BadRequestException('End date must be after start date');
    }
    
    const sprint = await this.findOne(workspaceId, sprintId);
    
    this.sprintRepository.assign(sprint, updateSprintDto);

    await this.em.flush();
    
    return sprint;
  }

  async remove(
    workspaceId: string,
    sprintId: string
  ): Promise<void> {
    const sprint = await this.findOne(workspaceId, sprintId);
    
    await this.em.removeAndFlush(sprint);
  }
}
