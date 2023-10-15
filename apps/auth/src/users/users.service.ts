import { Inject, Injectable, OnModuleInit, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs'
import { GetUserDto } from './dto/get-user.dto';
import { NOTIFICATIONS_SERVICE_NAME, NotificationsServiceClient } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';


@Injectable()
export class UsersService implements OnModuleInit{

    private notificationsService: NotificationsServiceClient

    constructor(
        private readonly usersRepository: UsersRepository, 
        @Inject(NOTIFICATIONS_SERVICE_NAME) private readonly client: ClientGrpc,
    ){}

    onModuleInit() {
        this.notificationsService = this.client.getService<NotificationsServiceClient>(NOTIFICATIONS_SERVICE_NAME)
    }

    async create(createUserDto: CreateUserDto){
        
        const password = await bcrypt.hash(createUserDto.password, 10)

        await this.validateCreateUserDto(createUserDto)
        
        // send email on successful user creation 
        this.notificationsService
        .notifyEmail({ email: createUserDto.email, text: "Some Test text"})
        .subscribe(() => {})

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
