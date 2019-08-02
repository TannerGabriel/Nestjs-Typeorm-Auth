import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.interface';
import { JwtPayloadService } from '../shared/jwt.payload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtPayloadService: JwtPayloadService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneByEmail(email): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.findOneByEmail(createUserDto.email);

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = new UserEntity();
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    newUser.username = createUserDto.username;

    const userResponse = await this.userRepository.save(newUser);
    const token = await this.jwtPayloadService.createJwtPayload(newUser);

    return { userResponse, token };
  }

  async update(_id: number, newUser: CreateUserDto) {
    const user = await this.userRepository.findOne(_id);

    if (user === undefined || user === null) {
      throw new HttpException("User doesn't exists", HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.merge(user, newUser);
    return await this.userRepository.save(user);
  }

  async deleteUserById(id: number) {
    return await this.userRepository.delete(id);
  }

  async deleteAll() {
    return await this.userRepository.clear();
  }
}
