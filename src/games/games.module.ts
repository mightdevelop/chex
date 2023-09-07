import { Module } from '@nestjs/common'
import { GamesController } from './games.controller'
import { GamesService } from './games.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Game } from './models/games.model'

@Module({
    imports: [
        SequelizeModule.forFeature([ Game ]),
    ],
    controllers: [ GamesController ],
    providers: [ GamesService ],
    exports: [ GamesService ],
})
export class GamesModule {}
