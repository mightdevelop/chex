import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UseGuards } from '@nestjs/common'
import { SocketIoJwtAuthGuard } from 'src/common/guards/socket-io-jwt-auth.guard'
import { UsersService } from 'src/users/users.service'
import { MovesService } from 'src/moves/moves.service'
import { MoveDto } from 'src/moves/dto/move.dto'
import { Move } from 'src/moves/models/moves.model'
import { RoomsDto } from './dto/rooms.dto'
import { User } from 'src/users/models/users.model'
import { SocketIoCurrentUser } from 'src/auth/decorators/socket-io-current-user.decorator'
import { UserFromRequest } from 'src/auth/types/user-from-request'

@UseGuards(SocketIoJwtAuthGuard)
@WebSocketGateway(8081, {
    cors: { origin: '*' }
})
export class Gateway {

    @WebSocketServer()
        server: Server

    constructor(
        private readonly usersService: UsersService,
        private readonly movesService: MovesService,
    ) {}

    @SubscribeMessage('subscribe')
    async subscribe(
        @MessageBody() { rooms }: RoomsDto,
        @ConnectedSocket() socket: Socket,
    ): Promise<void> {
        socket.join(rooms)
    }

    @SubscribeMessage('unsubscribe')
    async unsubscribe(
        @MessageBody() { rooms }: RoomsDto,
        @ConnectedSocket() socket: Socket,
    ): Promise<void> {
        rooms.forEach(room => socket.leave(room))
    }

    @SubscribeMessage('move')
    async move(
        @SocketIoCurrentUser() { id }: UserFromRequest,
        @MessageBody() dto: MoveDto,
    ): Promise<void> {
        try {
            const move: Move = await this.movesService.move({ ...dto, playerId: id })
            this.server
                .to('game:' + dto.gameId)
                .emit('move', { move })
        } catch (error) {
            this.server
                .to('user:' + id)
                .emit('move_error', { error })
        }
    }

    @SubscribeMessage('update_last_seen_online')
    async updateLastSeenOnline(
        @SocketIoCurrentUser() { id }: UserFromRequest,
    ): Promise<void> {
        const user: User = await this.usersService.updateUserLastSeenOnline(id)
        this.server
            .to('user:' + id)
            .emit('update_last_seen_online', { userId: id, lastSeen: user.lastSeen })
    }

}