import { WorkspaceMemberRoleEnum } from "src/common/enums/workspace-member-role.enum";

export class CreateWorkspaceMemberDto {
  role? = WorkspaceMemberRoleEnum.MEMBER;
}
