import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.interface';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOneByEmail(email): Promise<User> {
        return await this.userRepository.findOne({email});
    }

    async create(createUserDto: CreateUserDto) {
        const user = await this.findOneByEmail(createUserDto.email);

        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const newUser = new UserEntity();
        newUser.email = createUserDto.email;
        newUser.password = createUserDto.password;

        return await this.userRepository.save(newUser);
    }

    async deleteUserById(id: number) {
        return await this.userRepository.delete(id);
    }
}
