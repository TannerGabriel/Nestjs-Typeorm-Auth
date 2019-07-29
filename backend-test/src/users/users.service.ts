import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async create(createUserDto: CreateUserDto) {
        const newUser = new UserEntity();
        newUser.email = createUserDto.email;
        newUser.password = createUserDto.password;

        return await this.userRepository.save(newUser);
    }

    async signIn(loginUserDto: LoginUserDto) {
        const user = this.userRepository.findOne({email: loginUserDto.email});

        if (!user) {
            throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
        }
    }

    async checkPassword(password, user): Promise<boolean> {
        const state = bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) { return err; }
            return isMatch;
        });
        return state;
    }
}
