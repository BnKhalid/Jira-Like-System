import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { validate as uuidValidate } from 'uuid';
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (!uuidValidate(payload.sub)) {
      throw new UnauthorizedException('Invalid token: malformed user ID');
    }

    let user: User;
    
    try {
      user = await this.userService.findOne(payload.sub);
    }
    catch (NotFoundException) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const userClaims = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    }

    return userClaims;
  }
}