import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"

export class EditUserDto{
    @IsEmail()
    @IsOptional()
    email?: string

    @IsOptional()
    @IsStrongPassword()
    password?: string

    @IsString()
    @IsOptional()
    username?: string
}