import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '@app/common';
import { Response } from 'express'
import { TokenPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
    ){}


  async login(user: UserDocument, response: Response){
    
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString()
    }

    const expires = new Date()
    const expiresRefresh = new Date()

    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    expiresRefresh.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_REFRESH_EXPIRATION'),
    );



    const token = this.jwtService.sign(tokenPayload)
    const refreshToken = this.jwtService.sign(tokenPayload, {expiresIn:`${this.configService.get('JWT_REFRESH_EXPIRATION')}s`})


    //set jwt authentication token in cookies
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires
    })

    response.cookie('AuthenticationRefresh', refreshToken, {
      httpOnly: true,
      expires:expiresRefresh
    })
    
    return token

  }


  async refreshToken(user: UserDocument, response: Response){
    
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString()
    }

    const expires = new Date()

    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );



    const token = this.jwtService.sign(tokenPayload)


    //set jwt authentication token in cookies
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires
    })

    
    return token

  }




}
