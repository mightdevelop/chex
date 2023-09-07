import { Module } from '@nestjs/common'
import { MovesService } from './moves.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Move } from './models/moves.model'
import { MovesController } from './moves.controller'
import { GamesModule } from 'src/games/games.module'

@Module({
    imports: [
        GamesModule,
        SequelizeModule.forFeature([ Move ]),
    ],
    controllers: [ MovesController ],
    providers: [ MovesService ],
    exports: [ MovesService ],
})
export class MovesModule {}
