import { Module, forwardRef } from '@nestjs/common'
import { ChatsService } from './chats.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Chat } from './models/chats.model'
import { ChatUser } from './models/chat-user.model'
import { GamesModule } from 'src/games/games.module'

@Module({
    imports: [
        SequelizeModule.forFeature([ Chat, ChatUser ]),
        forwardRef(() => GamesModule),
    ],
    providers: [ ChatsService ],
    exports: [ ChatsService ],
})
export class ChatsModule {}
