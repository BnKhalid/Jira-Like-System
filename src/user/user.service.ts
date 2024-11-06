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
    const userExists = await this.userRepository.findOne({
      $or: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (userExists) {
      throw new ConflictException('Username or email already exists');
    }

    const saltRounds = Number(this.configService.get<string>('SALT_ROUNDS'));
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(createUserDto.password, salt);

    const user = new User();

    user.name = createUserDto.name;
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = hashedPassword;
    user.phone = createUserDto.phone;

    await this.em.persistAndFlush(user);

    return user;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    user.name = updateUserDto.name;
    user.username = updateUserDto.username;
    user.email = updateUserDto.email;
    user.phone = updateUserDto.phone;

    this.em.persistAndFlush(user);

    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    this.em.removeAndFlush(user);
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
}
