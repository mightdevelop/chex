import { Module } from '@nestjs/common'
import { Gateway } from './gateway'
import { MovesModule } from 'src/moves/moves.module'
import { GamesModule } from 'src/games/games.module'

@Module({
    imports: [
        MovesModule,
        GamesModule,
    ],
    providers: [ Gateway ],
})
export class GatewayModule {}
