import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Observable, catchError, map, of, tap } from "rxjs";
import { Services } from "../enums/services";
import { ClientProxy } from "@nestjs/microservices";
import { UserDto } from "../dto";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name)

    constructor(
        @Inject(Services.AUTH) private readonly authClient: ClientProxy,
        private readonly reflector: Reflector
        ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Extract the JWT token from the request cookies
        const jwt = 
            context.switchToHttp().getRequest().cookies?.Authentication ||
            context.switchToHttp().getRequest().headers?.Authentication 

        if (!jwt) {
            // If no JWT token is found, access is denied
            return false;
        }

        const roles = this.reflector.get<string[]>('roles', context.getHandler())

        // Send an 'authenticate' request to the authentication service via a ClientProxy
        return this.authClient.send<UserDto>('authenticate', {
            Authentication: jwt
        }).pipe(
            // Use 'tap' to manipulate the request context
            tap((res) => {
                //check for user roles and access
                if(roles){
                    for(const role of roles){
                        if(!res.roles?.includes(role)){
                            this.logger.error("The user does not have valid roles.")
                            throw new UnauthorizedException
                        }
                    }
                }
                // Set the user in the request context to the response from the authentication service
                context.switchToHttp().getRequest().user = res;
            }),
            // Map the result to 'true' to indicate successful authentication
            map(() => true),
            catchError((err) => {
                this.logger.error(err)
                return of(false)
            })
        );
    }
}
