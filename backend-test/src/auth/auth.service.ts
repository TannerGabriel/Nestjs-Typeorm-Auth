import { Injectable, UnauthorizedException, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUserByPassword(loginUserDto: LoginUserDto) {
        const user = await this.usersService.findOneByEmail(loginUserDto.email);

        if (!user) {
            throw new UnauthorizedException ('User does not exist');
        }

        return new Promise(async (resolve) => {
            const state = await this.checkPassword(loginUserDto.password, user);
            if (state) {
                resolve(this.createJwtPayload(user));
            } else {
                resolve(new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED));
            }
        });
    }

    async checkPassword(password: string, user): Promise<boolean> {
        let state = false;
        await bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) { return err; }
            state =  isMatch;
        });
        return state;
    }

    createJwtPayload(user) {
        const data: JwtPayload = {
            email: user.email,
        };

        const jwt = this.jwtService.sign(data);

        return {
            expiresIn: 3600,
            token: jwt,
        };
    }

    async validateUserByJwt(payload: JwtPayload) {
        const user = await this.usersService.findOneByEmail(payload.email);

        if (user) {
            return this.createJwtPayload(user);
        } else {
            throw new UnauthorizedException();
        }

    }
}
