import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Wrong credentials' })
  @Post('/email/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.validateUserByPassword(loginUserDto);
  }

  @Get('email/resend-verification/:email')
  async sendEmailVerification(@Param('email') email: string) {
    return await this.authService.createEmailToken(email);
  }

  @Post(':email')
  async sendVerificationEmail(@Param('email') email: string) {
    return await this.authService.sendEmailVerification(email);
  }

  @Get('email/verify/:token')
  async verifyEmail(@Param('token') token: string) {
    return await this.authService.verifyEmail(token);
  }
}
