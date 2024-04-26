import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript'
import { Chat } from 'src/chats/models/chats.model'
import { User } from 'src/users/models/users.model'

@Table({ tableName: 'messages' })
export class Message extends Model<Message> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String, example: 'Hello!' })
    @Column({ type: DataType.STRING, allowNull: false })
        content: string



    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => User)
        userId: string

    @ApiPropertyOptional({ type: User })
    @BelongsTo(() => User)
        user: User



    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Chat)
        chatId: string

    @ApiPropertyOptional({ type: Chat })
    @BelongsTo(() => Chat)
        chat: Chat

}