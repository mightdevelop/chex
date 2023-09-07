import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserFromRequest } from 'src/auth/types/user-from-request'

export const SocketIoCurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserFromRequest => {
        const req = ctx.switchToWs().getClient().handshake
        return req.user
    }
)