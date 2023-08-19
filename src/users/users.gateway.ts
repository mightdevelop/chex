import {
    ConnectedSocket,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UsersService } from './users.service'
import { User } from './models/users.model'
import { UseGuards } from '@nestjs/common'
import { SocketIoJwtAuthGuard } from 'src/auth/guards/socket-io-jwt-auth.guard'

@UseGuards(SocketIoJwtAuthGuard)
@WebSocketGateway(8081, {
    cors: { origin: '*' },
    namespace: 'users',
})
export class UsersGateway {

    @WebSocketServer()
        server: Server

    constructor(
        private usersService: UsersService,
    ) {}

    @SubscribeMessage('update_last_seen_online')
    async updateLastSeenOnline(
        @ConnectedSocket() socket: Socket
    ): Promise<void> {
        const userId: string = await this.usersService.getUserIdFromSocket(socket)
        const user: User = await this.usersService.updateUserLastSeenOnline(userId)
        this.server
            .to('user:' + userId)
            .emit('update_last_seen_online', { userId, lastSeen: user.lastSeen })
    }

}