import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { User } from './user.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneByEmail(email): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async update(_id: number | string, newUser: UpdateUserDto) {
    const user = await this.userRepository.findOne(_id);
    const userWithEmail = await this.userRepository.findOne({
      email: newUser.email,
    });

    if (user === undefined || user === null) {
      throw new HttpException("User doesn't exists", HttpStatus.BAD_REQUEST);
    } else if (
      userWithEmail !== null &&
      userWithEmail !== undefined &&
      newUser.email !== user.email
    ) {
      throw new HttpException('Email is already used', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.merge(user, newUser);
    return await this.userRepository.save(user);
  }

  async deleteUserById(id: number) {
    const user = await this.userRepository.findOne({ _id: id });

    if (user === undefined || user === null) {
      throw new HttpException("User doesn't exists", HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository.delete(id);
  }

  async deleteAll() {
    return await this.userRepository.clear();
  }
}
