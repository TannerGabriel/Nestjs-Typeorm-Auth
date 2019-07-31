import { Injectable, UnauthorizedException, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayloadService } from '../shared/jwt.payload.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private readonly jwtPayloadService: JwtPayloadService) {}

    async validateUserByPassword(loginUserDto: LoginUserDto) {
        const user = await this.usersService.findOneByEmail(loginUserDto.email);

        if (!user) {
            throw new UnauthorizedException ('User does not exist');
        }

        const promise: any = await new Promise(async (resolve) => {
            const state = await this.checkPassword(loginUserDto.password, user);
            if (state) {
                resolve(this.jwtPayloadService.createJwtPayload(user));
            } else {
                resolve({status: 401});
            }
        });

        if (promise.status !== 401) {
            return promise;
        } else {
            throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
        }
    }

    async checkPassword(password: string, user): Promise<boolean> {
        return new Promise(async (resolve) => {
            await bcrypt.compare(password, user.password, async (err, isMatch) => {
                if (err) { return err; }
                resolve(isMatch);
            });
        });
    }

    async validateUserByJwt(payload: JwtPayload) {
        const user = await this.usersService.findOneByEmail(payload.email);

        if (user) {
            return this.jwtPayloadService.createJwtPayload(user);
        } else {
            throw new UnauthorizedException();
        }
    }

}
