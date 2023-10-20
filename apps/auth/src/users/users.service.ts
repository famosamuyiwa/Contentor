import { BadRequestException, Inject, Injectable, OnModuleInit, ServiceUnavailableException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs'
import { GetUserDto } from './dto/get-user.dto';
import { NOTIFICATIONS_SERVICE_NAME, NotificationsServiceClient } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { EditUserDto } from './dto/edit-user.dto';


@Injectable()
export class UsersService implements OnModuleInit{

    private notificationsService: NotificationsServiceClient

    constructor(
        private readonly usersRepository: UsersRepository, 
        @Inject(NOTIFICATIONS_SERVICE_NAME) private readonly client: ClientGrpc,
    ){}

    //initialize notification service 
    onModuleInit() {
        this.notificationsService = this.client.getService<NotificationsServiceClient>(NOTIFICATIONS_SERVICE_NAME)
    }

    // create new user
    async create(createUserDto: CreateUserDto){
        
        const password = await bcrypt.hash(createUserDto.password, 10)

        await this.validateCreateUserDto(createUserDto)
        
        // send email on successful user creation 
        try{
            this.notificationsService
            .notifyEmail({ email: createUserDto.email, text: "Some Test text"})
            .subscribe(() => {})
        }catch(err){
            throw new ServiceUnavailableException(err)
        }
     

        const user = await this.usersRepository.create(
            {
                ...createUserDto,
                password
            }
        )
        
        delete user.password
        return user
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

    //check if user exists by username or email
    async verifyUser(usernameOrEmail: string, password: string){
        const user = await this.usersRepository.findOne({ 
            $or: [
                {email: usernameOrEmail},
                {username: usernameOrEmail} 
            ]
        })

        const passwordIsValid = await bcrypt.compare(password, user.password)

        if(!passwordIsValid){
            throw new UnauthorizedException('Credentials are not valid.')
        }

        return user
    }

    async getUser(getUserDto: GetUserDto){
        return this.usersRepository.findOne(getUserDto)
    }

    //update user details
    async updateUser(userId:string, editUserDto: EditUserDto ){
        if(!editUserDto.email && !editUserDto.password && !editUserDto.username){
            throw new BadRequestException("Supply user details to be updated")
        }
        try{
            //check if password was supplied
            if(editUserDto.password){
                // hash new password
                const password = await bcrypt.hash(editUserDto.password, 10)

                  //check if user exists, if not catch exception
                const user = await this.getUser({_id: userId})

                //update user details
                const updated_user = await this.usersRepository.findOneAndUpdate(
                    {_id: user._id },
                    {$set: {
                        ...editUserDto,
                        password
                    }}
                )
                    
                //hide password from user response being returned
                delete updated_user.password
                return updated_user
            }else{
                    //check if user exists, if not catch exception
                    const user = await this.getUser({_id: userId})

                    //update user details
                    const updated_user = await this.usersRepository.findOneAndUpdate(
                        {_id: user._id },
                        {$set: {
                            ...editUserDto
                        }}
                    )
                     //hide password from user response being returned
                    delete updated_user.password
                    return updated_user
            }
          
        }
        catch(err){
            throw new BadRequestException(err)
        }
    }
}
