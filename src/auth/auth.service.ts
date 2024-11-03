import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    private em: EntityManager,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    throw new Error('Not implemented');
  }

  async signIn(signInDto: SignInDto): Promise<{ token: string }> {
    throw new Error('Not implemented');
  }
}
