import { Module, forwardRef } from '@nestjs/common'
import { MessagesService } from './messages.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Message } from './models/messages.model'
import { ChatsModule } from 'src/chats/chats.module'

@Module({
    imports: [
        SequelizeModule.forFeature([ Message ]),
        forwardRef(() => ChatsModule),
    ],
    providers: [ MessagesService ],
    exports: [ MessagesService ],
})
export class MessagesModule {}
