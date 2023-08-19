import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { RoomsDto } from './dto/rooms.dto'

@WebSocketGateway(8081, {
    cors: { origin: '*' }
})
export class SocketIoGateway {

    @WebSocketServer()
        server: Server

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
        rooms.forEach(userId => socket.leave('user:' + userId))
    }

}