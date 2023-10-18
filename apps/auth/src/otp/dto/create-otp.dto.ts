import { Type } from "class-transformer"
import { IsBoolean, IsDate, IsNotEmpty, IsString } from "class-validator"

export class CreateOtpDTO {
    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    createdAt?: Date

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    updatedAt?: Date
   
    @IsNotEmpty()
    @IsBoolean()
    isActive?: Boolean
 
    @IsNotEmpty()
    @IsString()
    otp: string
}