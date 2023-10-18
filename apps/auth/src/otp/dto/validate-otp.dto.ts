import {  IsNotEmpty, IsString } from "class-validator"

export class ValidateOtpDTO {
    
    @IsNotEmpty()
    @IsString()
    otp: string
 
}