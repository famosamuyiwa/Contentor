import { AuthGuard } from "@nestjs/passport";

export class localAuthGuard extends AuthGuard('local'){}