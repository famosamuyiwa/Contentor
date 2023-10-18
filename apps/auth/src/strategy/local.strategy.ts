import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { UsersService } from "../users/users.service"
import { Strategy } from "passport-local"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
    constructor(private readonly userService: UsersService){
        super()
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

    // async validate(usernameOrEmail: string, password: string): Promise<any> {
    //     // Determine if usernameOrEmail is an email or a username
    //     const isEmail = usernameOrEmail.includes('@');
        
    //     let user;
        
    //     if (isEmail) {
    //       user = await this.authService.validateUserByEmail(usernameOrEmail, password);
    //     } else {
    //       user = await this.authService.validateUserByUsername(usernameOrEmail, password);
    //     }
        
    //     if (!user) {
    //       throw new UnauthorizedException('Invalid credentials');
    //     }
        
    //     return user;
    //   }
}