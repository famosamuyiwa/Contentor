import { Body, Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { OtpService } from './otp.service';
import { ValidateOtpDTO } from './dto/validate-otp.dto';

@Controller('otp')
export class OtpController {

    constructor(
        private readonly otpService: OtpService
    ){}

    //validate otp by user id
    @Get("/validate/:userId")
    validateOTP(@Body() validateOtpDTO: ValidateOtpDTO, @Param('userId') userId: string){
       return this.otpService.validateOTP(validateOtpDTO, userId)
    }
}
