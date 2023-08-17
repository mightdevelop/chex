import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UsersService } from './users.service'
import { UserIdListDto } from './dto/user-id-list.dto'
import { User } from './models/users.model'

@WebSocketGateway(8081, {
    // namespace: 'users',
    cors: { origin: '*' }
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
            .emit('last_seen_online_update', { userId, lastSeen: user.lastSeen })
    }

    @SubscribeMessage('subscribe_on_online_of_users')
    async subscribeOnOnlineOfUsers(
        @MessageBody() { userIdList }: UserIdListDto,
        @ConnectedSocket() socket: Socket,
    ): Promise<void> {
        const rooms: string[] = userIdList.map(userId => 'user:' + userId)
        socket.join(rooms)
    }

    @SubscribeMessage('unsubscribe_from_online_of_users')
    async unSubscribeFromOnlineOfUsers(
        @MessageBody() { userIdList }: UserIdListDto,
        @ConnectedSocket() socket: Socket,
    ): Promise<void> {
        userIdList.forEach(userId => socket.leave('user:' + userId))
    }

}