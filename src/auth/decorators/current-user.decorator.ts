import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserClaims } from '../interfaces/user-claims.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserClaims => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
