import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GenerateOTP, NOTIFICATIONS_SERVICE_NAME, NotificationsServiceClient, UserDocument } from '@app/common';
import { Response } from 'express'
import { TokenPayload } from './interfaces';
import { UsersRepository } from './users/users.repository';
import { ClientGrpc } from '@nestjs/microservices';
import { SendOtpDTO } from './users/dto/send-otp.dto';

@Injectable()
export class AuthService {

  private notificationsService: NotificationsServiceClient

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository ,
    @Inject(NOTIFICATIONS_SERVICE_NAME)private readonly client: ClientGrpc
    ){}


  async login(user: UserDocument, response: Response){
    
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString()
    }

    const expires = new Date()

    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION')
    )

    const token = this.jwtService.sign(tokenPayload)

    //set jwt authentication token in cookies
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires
    })
  }

  async sendOTP(sendOtpDTO: SendOtpDTO){

    //initialize notifications service at run time if OTP needs to be sent
    if(!this.notificationsService){
      this.notificationsService = this.client.getService<NotificationsServiceClient>(NOTIFICATIONS_SERVICE_NAME)
    }
    
    //check if user exists then send otp
    try{
      const user = await this.usersRepository.findOne({email: sendOtpDTO.email})

      this.notificationsService
      .notifyEmail({email: sendOtpDTO.email, text:`Your OTP is: ${GenerateOTP(5)}`})
      .subscribe(() => {})
      
      return user
    }
    catch(err){
      throw new BadRequestException(err)
    }

  }

}
