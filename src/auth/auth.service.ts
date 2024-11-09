import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './refresh-token.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: EntityRepository<RefreshToken>,
    private em: EntityManager,
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ userId: string, accessToken: string, refreshToken: string }> {
    const user = await this.userService.create(signUpDto);
    
    const tokens = await this.generateAccessTokens(user.id);

    return { userId: user.id, ...tokens};
  }

  async signIn(signInDto: SignInDto): Promise<{ userId: string, accessToken: string, refreshToken: string }> {
    const user = await this.userService.validateUser(signInDto.email, signInDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const tokens = await this.generateAccessTokens(user.id);

    return { userId: user.id, ...tokens };
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string, refreshToken: string }> {
    const token = await this.refreshTokenRepository.findOne({ token: refreshTokenDto.refreshToken });

    let payload: JwtPayload;
    
    try {
      payload = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken);
    }
    catch {
      throw new UnauthorizedException('Invalid Tokens');
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (payload.exp < currentTimestamp) {
      throw new UnauthorizedException('Expired refresh token');
    }

    const tokens = await this.generateAccessTokens(token.userId);

    return tokens;
  }

  private async generateAccessTokens(userId: string): Promise<{ accessToken: string, refreshToken: string }> {
    const accessToken = await this.jwtService.signAsync({ sub: userId });

    const existingToken = await this.refreshTokenRepository.findOne({ userId });

    if (existingToken) {
      await this.em.removeAndFlush(existingToken);
    }

    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token: await this.jwtService.signAsync(
        { sub: userId },
        { expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN') },
      ),
    });

    await this.em.persistAndFlush(refreshToken);

    return { accessToken, refreshToken: refreshToken.token };
  }
}
