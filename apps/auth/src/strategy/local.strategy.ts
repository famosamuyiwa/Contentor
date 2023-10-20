import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { UsersService } from "../users/users.service"
import { Strategy } from "passport-local"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
    constructor(private readonly userService: UsersService){
        super({
            usernameField: 'email' , // email is the key used, but value can either be email or username when calling
          })        
    }

    //check if user exists and credentials match
    async validate(usernameOrEmail: string, password: string){
        try{
            return this.userService.verifyUser(usernameOrEmail, password)
        }
        catch(err){
            throw new UnauthorizedException(err)
        }
    }

}