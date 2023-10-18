import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { UserDocument } from "../models/user.schema"

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
    const user = context.switchToHttp().getRequest().user
    delete user.password //remove password from response payload
    return user
}

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context)
)