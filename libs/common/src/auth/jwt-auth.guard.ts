import { CanActivate, ExecutionContext, Inject, Injectable, Logger, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { Observable, catchError, map, of, tap } from "rxjs";
import { ClientGrpc } from "@nestjs/microservices";
import { Reflector } from "@nestjs/core";
import { AUTH_SERVICE_NAME, AuthServiceClient } from "../types";

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
    private readonly logger = new Logger(JwtAuthGuard.name)
    private authService: AuthServiceClient

    constructor(
        @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
        private readonly reflector: Reflector
        ) {}

    onModuleInit() {
        this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME)
    }

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

        // Send an 'authenticate' request to the authentication service via authService grpc client
        return this.authService.authenticate({
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
                context.switchToHttp().getRequest().user = {
                    ...res,
                    _id: res.id
                };
            }),
            // Map the result to 'true' to indicate successful authentication or false if error 
            map(() => true),
            catchError((err) => {
                this.logger.error(err)
                return of(false)
            })
        );
    }
}
