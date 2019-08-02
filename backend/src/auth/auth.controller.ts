import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Wrong credentials' })
  @Post()
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.validateUserByPassword(loginUserDto);
  }
}
