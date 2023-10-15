import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthServiceController, AuthServiceControllerMethods, CurrentUser, UserDocument } from '@app/common';
import { Response } from 'express'
import { JwtAuthGuard, localAuthGuard } from './guards';
import {  Payload } from '@nestjs/microservices';

@Controller("auth")
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController{
  constructor(private readonly authService: AuthService) {}

  @UseGuards(localAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: UserDocument, @Res({ passthrough: true}) response: Response){
    await this.authService.login(user, response)
    response.send(user)
  }

  //authentication service exposed as a client grpc
  @UseGuards(JwtAuthGuard)
  async authenticate(@Payload() data: any){
    return {
      ...data.user,
      id: data.user._id
    }
  }

}
