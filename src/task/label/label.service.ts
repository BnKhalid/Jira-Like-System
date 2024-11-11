import { BadRequestException, Injectable } from '@nestjs/common';
import { Label } from './label.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: EntityRepository<Label>,
    private em: EntityManager,
  ) {}

  async findAll(
    workspaceId: string
  ): Promise<Label[]> {
    return await this.labelRepository.find(
      { workspace: { id: workspaceId } }
    );
  }

  async tryGetLabel(
    workspaceId: string,
    content: string
  ): Promise<Label> {
    let label = await this.labelRepository.findOne(
      { content, workspace: { id: workspaceId } }
    );

    if (!label) {
      label = this.labelRepository.create({ content, workspace: { id: workspaceId } });
      await this.em.persistAndFlush(label);
    }

    return label;
  }

  async deleteLabelIfUnused(
    workspaceId: string,
    labelId: string
  ): Promise<void> {
    const label = await this.labelRepository.findOne(
      { id: labelId, workspace: { id: workspaceId } },
      { populate: ['tasks'] }
    );

    if (label && label.tasks.length === 0) {
      await this.em.removeAndFlush(label);
    }
  }
}
