import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async findOneByEmail(email): Promise<UserEntity> {
        return await this.userRepository.findOne({email});
    }

    async create(createUserDto: CreateUserDto) {
        const newUser = new UserEntity();
        newUser.email = createUserDto.email;
        newUser.password = createUserDto.password;

        return await this.userRepository.save(newUser);
    }
}
