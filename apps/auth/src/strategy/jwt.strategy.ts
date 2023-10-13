import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { UsersService } from "../users/users.service"
import { ExtractJwt, Strategy } from "passport-jwt"
import { TokenPayload } from "../interfaces"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        configService: ConfigService,
        private readonly userService: UsersService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => request?.cookies?.Authentication || request?.Authentication,
            ]),
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate({ userId }: TokenPayload){
        return this.userService.getUser({ _id: userId})
    }
}