import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, Includeable, DestroyOptions } from 'sequelize'
import { Message } from './models/messages.model'
import { CreateMessageDto } from './dto/create-message.dto'
import { ChatsService } from 'src/chats/chats.service'


@Injectable()
export class MessagesService {

    constructor(
        @InjectModel(Message)
        private readonly messageRepository: typeof Message,
        private readonly chatsService: ChatsService,
    ) {}

    async getMessages(
        limit?: number,
        offset?: number,
        include?: Includeable | Includeable[],
    ): Promise<Message[]> {
        const messages: Message[] = await this.messageRepository.findAll({ limit, offset, include })
        return messages
    }

    async getMessageById(
        messageId: string,
        include?: Includeable | Includeable[],
    ): Promise<Message> {
        const message: Message = await this.messageRepository.findByPk(messageId, { include })
        return message
    }

    async getMessagesByIdsArray(
        messagesIds: string[],
        include?: Includeable | Includeable[],
    ): Promise<Message[]> {
        const messages: Message[] = await this.messageRepository.findAll({
            where: { [Op.or]: { id: messagesIds } },
            include,
        })
        return messages
    }

    async getMessagesByChatId(
        chatId: string,
        include?: Includeable | Includeable[],
    ): Promise<Message[]> {
        const messages: Message[] = await this.messageRepository.findAll({ where: { chatId }, include })
        return messages
    }

    async sendMessage(
        dto: CreateMessageDto
    ): Promise<Message> {
        const chatterIdList = await this.chatsService.getChatterIdListByChatId(dto.chatId)
        if (!chatterIdList.includes(dto.userId))
            throw new ForbiddenException('You are not a participant of this chat')

        const message: Message = await this.createMessage(dto)
        return message
    }

    private async createMessage(
        dto: CreateMessageDto
    ): Promise<Message> {
        const message: Message = await this.messageRepository.create(dto)
        return message
    }

    async deleteMessage(
        messageId: string,
        options?: DestroyOptions,
    ): Promise<Message> {
        const message: Message = await this.messageRepository.findByPk(messageId)
        if (!message)
            throw new NotFoundException('Message not found')

        await this.messageRepository.destroy({ where: { id: messageId }, ...options })
        return message
    }

}