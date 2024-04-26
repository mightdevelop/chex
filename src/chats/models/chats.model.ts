import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType, Model, Table, HasOne, HasMany, BelongsToMany } from 'sequelize-typescript'
import { ChatUser } from './chat-user.model'
import { User } from 'src/users/models/users.model'
import { Message } from 'src/messages/models/messages.model'
import { Game } from 'src/games/models/games.model'

@Table({ tableName: 'chats' })
export class Chat extends Model<Chat> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiPropertyOptional({ type: [ Game ] })
    @HasOne(() => Game)
        game: Game

    @ApiPropertyOptional({ type: [ Message ] })
    @HasMany(() => Message)
        messages: Message[]

    @ApiPropertyOptional({ type: [ User ] })
    @BelongsToMany(() => User, () => ChatUser)
        users: User[]

}