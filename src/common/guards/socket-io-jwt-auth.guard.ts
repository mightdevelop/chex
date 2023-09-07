import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { WsException } from '@nestjs/websockets'

@Injectable()
export class SocketIoJwtAuthGuard extends AuthGuard('socket-io-jwt') {

    getRequest<T = any>(context: ExecutionContext): T {
        return context.switchToWs().getClient().handshake
    }

    handleRequest(err, user) {
        if (err || !user) {
            throw new WsException({ status: 401, message: 'Unauthorized' })
        }
        return user
    }

}