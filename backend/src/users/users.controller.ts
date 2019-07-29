import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    // constructor(private readonly usersService: UsersService) {}

    // @Post()
    // async createUser(@Body() user: CreateUserDto) {
    //     return this.usersService.create(user);
    // }

    // @Get()
    // async getAllUsers() {
    //     return this.usersService.findAll();
    // }
}
