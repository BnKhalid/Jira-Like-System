import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
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

    const user = await this.userRepository.findOne({ id: payload.sub });
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
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