import { Role } from '../../common/enums/role.enum';

export interface UserClaims {
  id: string;
  name: string;
  username: string;
  email: string;
  roles: Map<string, Role>;
}
