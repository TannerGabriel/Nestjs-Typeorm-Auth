import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

const EXPIRES_IN = 3600;

@Injectable()
export class JwtPayloadService {
    constructor(private readonly jwtService: JwtService) {}

    createJwtPayload(user) {
        const data: JwtPayload = {
            email: user.email,
        };

        let jwt;
        try {
            jwt = this.jwtService.sign(data);
        } catch (error) {
            throw new HttpException('Internal Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            expiresIn: EXPIRES_IN,
            token: jwt,
        };
    }
}
