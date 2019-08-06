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
import { transporter } from '../shared/email-constants';
import 'dotenv/config';
import { UserEntity } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtPayloadService: JwtPayloadService,
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: Repository<
      EmailVerificationEntity
    >,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(createUserDto.email);

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
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
  }

  async sendEmailVerification(email: string) {
    const repository = await this.emailVerificationRepository.findOne({
      email,
    });

    if (repository && repository.emailToken) {
      const mailOptions = {
        from: '"Company" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Verify Email',
        text: 'Verify Email',
        html: `Hi! <br><br> Thanks for your registration<br><br>
          <a href='${process.env.URL}:${process.env.PORT}/auth/email/verify/${repository.emailToken}'>Click here to activate your account</a>`,
      };

      return await this.sendEmail(mailOptions);
    } else {
      throw new HttpException('User not found', HttpStatus.FORBIDDEN);
    }
  }

  async sendEmail(mailOptions) {
    return await new Promise<{}>(async (resolve, reject) => {
      return await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          Logger.log(
            `Error while sending message: ${error}`,
            'sendEmailVerification',
          );
          return reject(error);
        }
        Logger.log(`Send message: ${info.messageId}`, 'sendEmailVerification');
        resolve({ message: 'Successfully send email' });
      });
    });
  }
}
