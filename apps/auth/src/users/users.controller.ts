import { Body, Controller, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../decorators';
import { UserDocument } from '@app/common';
import { JwtAuthGuard } from '../guards';
import { Response } from 'express'
import { EditUserDto } from './dto/edit-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}
    
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(@CurrentUser() user: UserDocument, @Res({ passthrough: true}) response: Response){
            response.send(user)
        }

    //update user details
    @Patch('/:id')
    async updateUser(@Body() editUserDTO: EditUserDto, @Param("id") userId: string){
        return this.userService.updateUser(userId, editUserDTO)
    }
    
}
