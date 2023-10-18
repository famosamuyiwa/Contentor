import { IsNotEmpty, IsString } from "class-validator"

export class SendOtpDTO {
    @IsString()
    @IsNotEmpty()
    email: string
}