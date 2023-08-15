import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserFromRequest } from 'src/auth/types/user-from-request'

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserFromRequest => {
        const req = ctx.switchToHttp().getRequest()
        return req.user
    }
)