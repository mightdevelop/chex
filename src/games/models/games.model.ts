import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'
import { Chat } from 'src/chats/models/chats.model'
import { Move } from 'src/moves/models/moves.model'
import { User } from 'src/users/models/users.model'

@Table({ tableName: 'games' })
export class Game extends Model<Game> {

    @ApiProperty({ type: String, format: '11 char nanoid string', example: 'Vtybm0S3zre' })
    @Column({ type: DataType.STRING, unique: true, primaryKey: true })
        id: string



    @ApiProperty({ type: String, format: 'fen',
        example: 'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - - 0 19' })
    @Column({ type: DataType.STRING })
        fen: string



    @ApiPropertyOptional({ type: [ Move ] })
    @HasMany(() => Move)
        moves: Move[]



    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
    @ForeignKey(() => Chat)
        chatId: string

    @ApiPropertyOptional({ type: Chat })
    @BelongsTo(() => Chat)
        chat: Chat




    @ApiPropertyOptional({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID })
    @ForeignKey(() => User)
        whiteId: string

    @ApiPropertyOptional({ type: User })
    @BelongsTo(() => User)
        white: User



    @ApiPropertyOptional({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID })
    @ForeignKey(() => User)
        blackId: string

    @ApiPropertyOptional({ type: User })
    @BelongsTo(() => User)
        black: User



    @ApiPropertyOptional({ type: String, example: '3+0' })
    @Column({ type: DataType.STRING })
        timeControl: string



    @ApiPropertyOptional({ type: String, example: 'Blitz game' })
    @Column({ type: DataType.STRING })
        event: string

    @ApiPropertyOptional({ type: String })
    @Column({ type: DataType.STRING })
        site: string

    @ApiPropertyOptional({ type: String, example: '1-0' })
    @Column({ type: DataType.STRING })
        result: string

    @ApiPropertyOptional({ type: String, example: 'Queen\'s Gambit Declined: Marshall Defense' })
    @Column({ type: DataType.STRING })
        opening: string

    @ApiPropertyOptional({ type: String, example: 'Time forfeit' })
    @Column({ type: DataType.STRING })
        termination: string

    @ApiPropertyOptional({ type: String })
    @Column({ type: DataType.STRING })
        annotator: string

    @ApiPropertyOptional({ type: Date })
    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
        startDate: Date

    @ApiPropertyOptional({ type: Date })
    @Column({ type: DataType.DATE })
        endDate: Date

}