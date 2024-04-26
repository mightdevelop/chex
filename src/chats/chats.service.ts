import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, Includeable, DestroyOptions  } from 'sequelize'
import { Chat } from './models/chats.model'
import { GamesService } from 'src/games/games.service'
import { Game } from 'src/games/models/games.model'
import { CreateChatDto } from './dto/create-chat.dto'
import { ChatUser } from './models/chat-user.model'
import { JoinChatDto } from './dto/join-chat.dto'


@Injectable()
export class ChatsService {

    constructor(
        @InjectModel(Chat)
        private readonly chatRepository: typeof Chat,
        @InjectModel(ChatUser)
        private readonly chatUserRepository: typeof ChatUser,
        @Inject(forwardRef(() => GamesService))
        private readonly gamesService: GamesService,
    ) {}

    async getChats(
        limit?: number,
        offset?: number,
        include?: Includeable | Includeable[],
    ): Promise<Chat[]> {
        const chats: Chat[] = await this.chatRepository.findAll({ limit, offset, include })
        return chats
    }

    async getChatById(
        chatId: string,
        include?: Includeable | Includeable[],
    ): Promise<Chat> {
        const chat: Chat = await this.chatRepository.findByPk(chatId, { include })
        return chat
    }

    async getChatsByIdsArray(
        chatsIds: string[],
        include?: Includeable | Includeable[],
    ): Promise<Chat[]> {
        const chats: Chat[] = await this.chatRepository.findAll({
            where: { [Op.or]: { id: chatsIds } },
            include,
        })
        return chats
    }

    async getChatByGameId(
        gameId: string,
        include?: Includeable | Includeable[],
    ): Promise<Chat> {
        const game: Game = await this.gamesService.getGameById(
            gameId,
            { model: Chat, include: Array.isArray(include) ? include : [ include ] },
        )
        return game.chat
    }

    async getChatterIdListByChatId(
        chatId: string,
    ): Promise<string[]> {
        const chatUserRows: ChatUser[] = await this.chatUserRepository.findAll({ where: { chatId } })
        const chatterIdList: string[] = chatUserRows.map(row => row.userId)
        return chatterIdList
    }

    async createChat(
        { userIdList }: CreateChatDto
    ): Promise<Chat> {
        const chat: Chat = await this.chatRepository.create()
        await this.chatUserRepository.create(userIdList.map(userId => ({ userId, chatId: chat.id })))
        return chat
    }

    async deleteChat(
        chatId: string,
        options?: DestroyOptions,
    ): Promise<Chat> {
        const chat: Chat = await this.chatRepository.findByPk(chatId)
        if (!chat)
            throw new NotFoundException('Chat not found')

        await this.chatRepository.destroy({ where: { id: chatId }, ...options })
        return chat
    }

    async joinChat(
        { userIdList, chatId }: JoinChatDto
    ): Promise<void> {
        await this.chatUserRepository.create(userIdList.map(userId => ({ userId, chatId: chatId })))
    }

}