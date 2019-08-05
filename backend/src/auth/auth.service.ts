import {
  Injectable,
  UnauthorizedException,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayloadService } from '../shared/jwt.payload.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { EmailVerificationEntity } from './entities/emailverification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtPayloadService: JwtPayloadService,
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: Repository<
      EmailVerificationEntity
    >,
  ) {}

  async validateUserByPassword(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(loginUserDto.email);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const promise: any = await new Promise(async resolve => {
      const state = await this.checkPassword(loginUserDto.password, user);
      if (state) {
        resolve(this.jwtPayloadService.createJwtPayload(user));
      } else {
        resolve({ status: 401 });
      }
    });

    if (promise.status !== 401) {
      return promise;
    } else {
      throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async checkPassword(password: string, user): Promise<boolean> {
    return new Promise(async resolve => {
      await bcrypt.compare(password, user.password, async (err, isMatch) => {
        if (err) {
          return err;
        }
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

  async createEmailToken(email: string) {
    const emailVerification = await this.emailVerificationRepository.findOne({
      email,
    });

    if (!emailVerification) {
      const emailVerificationToken = await this.emailVerificationRepository.save(
        {
          email,
          emailToken: (
            Math.floor(Math.random() * 9000000) + 1000000
          ).toString(),
          timestamp: new Date(),
        },
      );
      return emailVerificationToken;
    }
    return false;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const emailVerif = await this.emailVerificationRepository.findOne({
      emailToken: token,
    });
    if (emailVerif && emailVerif.email) {
      const userFromDb = await this.usersService.findOneByEmail(
        emailVerif.email,
      );
      if (userFromDb) {
        await this.usersService.update(userFromDb._id, {
          verified: true,
        });

        await this.emailVerificationRepository.delete({ emailToken: token });
        return true;
      }
    } else {
      throw new HttpException(
        'LOGIN.EMAIL_CODE_NOT_VALID',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async sendEmailVerification(email: string) {
    const repository = await this.emailVerificationRepository.findOne({
      email,
    });

    if (repository && repository.emailToken) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: '"Company" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Verify Email',
        text: 'Verify Email',
        html: `Hi! <br><br> Thanks for your registration<br><br>
          <a href='${process.env.URL}:${process.env.PORT}/auth/email/verify/${repository.emailToken}'>Click here to activate your account</a>`,
      };

      const sent = await new Promise<boolean>(async (resolve, reject) => {
        return await transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            Logger.log(
              `Error while sending message: ${error}`,
              'sendEmailVerification',
            );
            return reject(false);
          }
          Logger.log(
            `Send message: ${info.messageId}`,
            'sendEmailVerification',
          );
          resolve(true);
        });
      });

      return sent;
    } else {
      throw new HttpException(
        'REGISTER.USER_NOT_REGISTERED',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
