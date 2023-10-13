import { Inject, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs'
import { GetUserDto } from './dto/get-user.dto';
import { Services } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository, 
        @Inject(Services.NOTIFICATIONS)
        private readonly notificationsService: ClientProxy
    ){}

    async create(createUserDto: CreateUserDto){
        
        const password = await bcrypt.hash(createUserDto.password, 10)

        await this.validateCreateUserDto(createUserDto)
        
        // send email on successful user creation 
        this.notificationsService.emit('notify_email', { email: createUserDto.email, text: "Some Test text"})

        return this.usersRepository.create(
            {
                ...createUserDto,
                password
            }
        )
    }

    //Check if email already exists
    private async validateCreateUserDto(createUserDto: CreateUserDto){
        try{
            await this.usersRepository.findOne({
                email: createUserDto.email
            })
        }
        catch(err){
            return
        }
        throw new UnprocessableEntityException("Email already exists.")
    }

    async verifyUser(email: string, password: string){
        const user = await this.usersRepository.findOne({ email })
        const passwordIsValid = await bcrypt.compare(password, user.password)

        if(!passwordIsValid){
            throw new UnauthorizedException('Credentials are not valid.')
        }

        return user
    }

    async getUser(getUserDto: GetUserDto){
        return this.usersRepository.findOne(getUserDto)
    }
}
