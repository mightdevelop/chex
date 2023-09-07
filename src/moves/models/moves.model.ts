import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { Color } from '../types/color.enum'

@Table({ tableName: 'moves' })
export class Move extends Model<Move> {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
        id: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @Column({ type: DataType.UUID, allowNull: false })
        gameId: string

    @ApiProperty({ type: Number, example: 2 })
    @Column({ type: DataType.SMALLINT, allowNull: false })
        sequenceNumber: number

    @ApiProperty({ type: String, format: 'algebraic notation', example: 'Rxg4' })
    @Column({ type: DataType.STRING, allowNull: false })
        notation: string

    @ApiProperty({ type: Color, format: '"white" or "black"', example: 'white' })
    @Column({ type: DataType.STRING, allowNull: false })
        playerColor: 'w' | 'b'

}