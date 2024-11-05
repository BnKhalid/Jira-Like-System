import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../user/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, genSalt } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './refresh-token.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: EntityRepository<RefreshToken>,
    private em: EntityManager,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ userId: string, accessToken: string, refreshToken: string }> {
    const userExists = await this.userRepository.findOne({
      $or: [{ email: signUpDto.email }, { username: signUpDto.username }],
    });

    if (userExists) {
      throw new ConflictException('Username or email already exists');
    }

    const saltRounds = Number(this.configService.get<string>('SALT_ROUNDS'));
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(signUpDto.password, salt);

    const user = new User();

    user.name = signUpDto.name;
    user.username = signUpDto.username;
    user.email = signUpDto.email;
    user.password = hashedPassword;
    user.phone = signUpDto.phone;

    this.userRepository.create(user);

    await this.em.flush();
    
    const tokens = await this.generateAccessTokens(user.id);

    return { userId: user.id, ...tokens};
  }

  async signIn(signInDto: SignInDto): Promise<{ userId: string, accessToken: string, refreshToken: string }> {
    const user = await this.validateUser(signInDto.email, signInDto.password);

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

  async generateAccessTokens(userId: string): Promise<{ accessToken: string, refreshToken: string }> {
    const accessToken = await this.jwtService.signAsync({ sub: userId });

    const existingToken = await this.refreshTokenRepository.findOne({ userId });

    if (existingToken) {
      this.em.removeAndFlush(existingToken);
    }

    const refreshToken = new RefreshToken();
    refreshToken.userId = userId;
    refreshToken.expiresAt.setDate(new Date().getDate() + 3);

    await this.em.persistAndFlush(refreshToken);

    return { accessToken, refreshToken: refreshToken.token };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ email });

    const isEqual = await user.validatePassword(password);

    if (!user || !isEqual) {
      return null;
    }

    return user;
  }
}
