import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserClaims } from '../interfaces/user-claims.interface';
import { Role } from '../../common/enums/role.enum';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.getRoles(context);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    
    const workspaceId = request.params.workspaceId;

    if (!workspaceId) {
      return true;
    }

    const user: UserClaims = request.user;

    const currentUserRole = user?.roles.get(workspaceId);
    
    switch (currentUserRole) {
      case Role.LEADER:
        return true;
      case Role.ADMIN:
        return roles.some(role => role !== Role.LEADER);
      case Role.MEMBER:
        return roles.some(role => role === Role.MEMBER);
      default:
        return false;
    }
  }

  private getRoles(context: ExecutionContext): Role[] {
    return this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
  }
}
