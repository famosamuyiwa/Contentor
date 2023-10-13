import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { UsersService } from "../users/users.service"
import { Strategy } from "passport-local"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
    constructor(private readonly userService: UsersService){
        super({ usernameField: 'email'})
    }

    //check if user exists and credentials match
    async validate(email: string, password: string){
        try{
            return this.userService.verifyUser(email, password)
        }
        catch(err){
            throw new UnauthorizedException(err)
        }
    }
}