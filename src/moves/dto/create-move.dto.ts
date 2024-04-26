import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'
import { Color } from '../types/color.enum'

export class CreateMoveDto {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        gameId: string

    @ApiProperty({ type: String, example: 'Rxg4' })
    @IsString()
        notation: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        playerId: string

    @ApiPropertyOptional({ type: Color, format: '"w" or "b"', example: 'w' })
    @IsOptional()
    @IsString()
        playerColor?: 'w' | 'b'

}