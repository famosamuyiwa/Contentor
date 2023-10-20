import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { UsersService } from "../users/users.service"
import { ExtractJwt, Strategy } from "passport-jwt"
import { TokenPayload } from "../interfaces"

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(
        configService: ConfigService,
        private readonly userService: UsersService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => request?.cookies?.AuthenticationRefresh || request?.AuthenticationRefresh,
            ]),
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate({ userId }: TokenPayload){
        return this.userService.getUser({ _id: userId})
    }
}