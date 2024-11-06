import { IsEnum, IsOptional } from "class-validator";
import { WorkspaceMemberRoleEnum } from "src/common/enums/workspace-member-role.enum";

export class CreateWorkspaceMemberDto {
  @IsOptional()
  @IsEnum(WorkspaceMemberRoleEnum)
  role? = WorkspaceMemberRoleEnum.MEMBER;
}
