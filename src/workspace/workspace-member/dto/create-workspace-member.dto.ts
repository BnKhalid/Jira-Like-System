import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

export class CreateWorkspaceMemberDto {
  @IsOptional()
  @IsEnum(Role)
  role? = Role.MEMBER;

  @IsUUID()
  UserId!: string;
}
