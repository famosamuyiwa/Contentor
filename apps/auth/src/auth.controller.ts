import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, UserDocument } from '@app/common';
import { Response } from 'express'
import { JwtAuthGuard, localAuthGuard } from './guards';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(localAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: UserDocument, @Res({ passthrough: true}) response: Response){
    await this.authService.login(user, response)
    response.send(user)
  }

  //authentication service exposed as a client proxy
  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any){
    return data.user
  }

}
