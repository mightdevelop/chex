import { Global, Module } from '@nestjs/common'
import { SocketIoGateway } from './socketio.gateway'

@Global()
@Module({
    providers: [ SocketIoGateway ],
    exports: [ SocketIoGateway ],
})
export class SocketIoModule {}
