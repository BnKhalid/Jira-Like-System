import { ConflictException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { genSalt, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    private em: EntityManager,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkConflict(createUserDto.email, createUserDto.username);

    const saltRounds = Number(this.configService.get<string>('SALT_ROUNDS'));
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;
    
    const user = this.userRepository.create(createUserDto);

    await this.em.persistAndFlush(user);

    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.checkConflict(updateUserDto.email, updateUserDto.username);

    const user = await this.findOne(id);
    
    this.em.assign(user, updateUserDto);

    await this.em.persistAndFlush(user);

    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.em.removeAndFlush(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isEqual = await user.validatePassword(password);

    if (!user || !isEqual) {
      return null;
    }

    return user;
  }

  private async checkConflict(email: string, username: string): Promise<void> {
    const isEmailExists = await this.userRepository.findOne({ email });

    if (isEmailExists) {
      throw new ConflictException('Email already exists');
    }

    const isUsernameExists = await this.userRepository.findOne({ username });

    if (isUsernameExists) {
      throw new ConflictException('Username already exists');
    }
  }
}
