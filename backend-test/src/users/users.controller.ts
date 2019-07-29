import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.interface';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async createUser(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }

    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':email')
    async getUserByEmail(@Param('email') email: string): Promise<User> {
        return this.usersService.findOneByEmail(email);
    }

    @Delete(':id')
    async deleteUserById(@Param('id') id: number) {
        return this.usersService.deleteUserById(id);
    }
}
