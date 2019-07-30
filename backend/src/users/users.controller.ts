import { Controller, Post, Body, Get, Delete, Param, UseGuards, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.interface';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('users')
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

    @Put('test')
    @UseGuards(AuthGuard('jwt'))
    testAuthRoute() {
        return 'Hello authentificated user';
    }
}
