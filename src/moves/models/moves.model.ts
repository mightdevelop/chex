import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType, Model, Table, BelongsTo, ForeignKey } from 'sequelize-typescript'
import { Color } from '../types/color.enum'
import { Game } from 'src/games/models/games.model'

@Table({ tableName: 'moves' })
export class Move extends Model<Move> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string



    @ApiProperty({ type: String, format: '11 char nanoid string', example: 'Vtybm0S3zre' })
    @Column({ type: DataType.STRING, allowNull: false })
    @ForeignKey(() => Game)
        gameId: string

    @ApiPropertyOptional({ type: Game })
    @BelongsTo(() => Game)
        game: Game



    @ApiProperty({ type: Number, example: 2 })
    @Column({ type: DataType.SMALLINT, allowNull: false })
        sequenceNumber: number

    @ApiProperty({ type: String, format: 'algebraic notation', example: 'Rxg4' })
    @Column({ type: DataType.STRING, allowNull: false })
        notation: string

    @ApiProperty({ type: Color, format: '"w" or "b"', example: 'w' })
    @Column({ type: DataType.STRING, allowNull: false })
        playerColor: 'w' | 'b'

}