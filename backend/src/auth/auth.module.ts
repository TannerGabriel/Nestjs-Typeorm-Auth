import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import 'dotenv/config';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt', session: true }),
  JwtModule.register({
    secret: process.env.SECRET_KEY,
    signOptions: {
      expiresIn: 3600,
    },
  }),
  UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
