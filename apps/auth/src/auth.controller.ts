import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthServiceController, AuthServiceControllerMethods, CurrentUser, UserDocument } from '@app/common';
import { Response } from 'express'
import { JwtAuthGuard, RefreshJwtGuard, localAuthGuard } from './guards';
import {  Payload } from '@nestjs/microservices';
import { SendOtpDTO } from './otp/dto';
import { OtpService } from './otp/otp.service';

@Controller("auth")
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController{
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    ) {}

  @UseGuards(localAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: UserDocument, @Res({ passthrough: true}) response: Response){
    await this.authService.login(user, response)
    response.send(user)
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  async refreshToken(@CurrentUser() user: UserDocument, @Res({ passthrough: true}) response: Response){
    await this.authService.refreshToken(user, response)
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

  //send otp
  @Post('forgot-password')
  async sendForgotPasswordOTP(@Body() email: SendOtpDTO){
    return this.otpService.sendOTP(email)
  }

  

}
