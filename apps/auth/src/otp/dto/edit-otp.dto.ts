import { Type } from "class-transformer"
import { IsBoolean, IsDate, IsNotEmpty, IsString } from "class-validator"

export class EditOtpDTO {

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    updatedAt?: Date
  
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    sentAt?: Date
  
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    expiredAt?: Date
   
    @IsNotEmpty()
    @IsBoolean()
    isActive?: Boolean
 
}