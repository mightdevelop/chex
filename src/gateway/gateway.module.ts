import { Module } from '@nestjs/common'
import { Gateway } from './gateway'
import { MovesModule } from 'src/moves/moves.module'
import { GamesModule } from 'src/games/games.module'
import { MessagesModule } from 'src/messages/messages.module'

@Module({
    imports: [
        MovesModule,
        GamesModule,
        MessagesModule,
    ],
    providers: [ Gateway ],
})
export class GatewayModule {}
