import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './refresh-token.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: EntityRepository<RefreshToken>,
    private em: EntityManager,
    private jwtService: JwtService,
    private userService: UserService
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

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
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

    const refreshToken = new RefreshToken();
    refreshToken.userId = userId;
    refreshToken.expiresAt.setDate(new Date().getDate() + 3);

    await this.em.persistAndFlush(refreshToken);

    return { accessToken, refreshToken: refreshToken.token };
  }
}
