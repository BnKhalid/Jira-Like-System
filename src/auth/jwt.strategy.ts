import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserClaims } from './interfaces/user-claims.interface';
import { WorkspaceMemberService } from '../workspace/workspace-member/workspace-member.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userService: UserService,
    private workspaceMemberService: WorkspaceMemberService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserClaims> {
    let user: User;
    
    try {
      user = await this.userService.findOne(payload.sub);
    }
    catch (NotFoundException) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const roles = await this.workspaceMemberService.getRoles(user.id);

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      roles
    };
  }
}