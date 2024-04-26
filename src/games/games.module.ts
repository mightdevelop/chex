import { Module, forwardRef } from '@nestjs/common'
import { GamesController } from './games.controller'
import { GamesService } from './games.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Game } from './models/games.model'
import { ChatsModule } from 'src/chats/chats.module'

@Module({
    imports: [
        SequelizeModule.forFeature([ Game ]),
        forwardRef(() => ChatsModule),
    ],
    controllers: [ GamesController ],
    providers: [ GamesService ],
    exports: [ GamesService ],
})
export class GamesModule {}
