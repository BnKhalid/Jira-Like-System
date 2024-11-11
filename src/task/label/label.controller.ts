import { Controller, Get, Param } from '@nestjs/common';
import { LabelService } from './label.service';
import { Label } from './label.entity';
import { Role } from '../../common/enums/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('api/workspaces/:workspaceId')
export class LabelController {
  constructor(private labelService: LabelService) {}

  @Get('labels')
  @Roles(Role.MEMBER)
  findAll(
    @Param('workspaceId') workspaceId: string,
  ): Promise<Label[]> {
    return this.labelService.findAll(workspaceId);
  }
}
