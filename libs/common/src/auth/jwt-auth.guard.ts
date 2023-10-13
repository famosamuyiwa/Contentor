import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Observable, map, tap } from "rxjs";
import { Services } from "../enums/services";
import { ClientProxy } from "@nestjs/microservices";
import { UserDto } from "../dto";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(@Inject(Services.AUTH) private readonly authClient: ClientProxy) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Extract the JWT token from the request cookies
        const jwt = context.switchToHttp().getRequest().cookies?.Authentication;

        if (!jwt) {
            // If no JWT token is found, access is denied
            return false;
        }

        // Send an 'authenticate' request to the authentication service via a ClientProxy
        return this.authClient.send<UserDto>('authenticate', {
            Authentication: jwt
        }).pipe(
            // Use 'tap' to manipulate the request context
            tap((res) => {
                // Set the user in the request context to the response from the authentication service
                context.switchToHttp().getRequest().user = res;
            }),
            // Map the result to 'true' to indicate successful authentication
            map(() => true)
        );
    }
}
