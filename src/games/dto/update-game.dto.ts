import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

export class UpdateGameDto {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        gameId: string

    @ApiProperty({ type: String, format: 'fen',
        example: 'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - - 0 19' })
    @IsOptional()
    @IsString()
        fen?: string

    @ApiPropertyOptional({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsOptional()
    @IsUUID()
        whiteId?: string

    @ApiPropertyOptional({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsOptional()
    @IsUUID()
        blackId?: string

    @ApiPropertyOptional({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsOptional()
    @IsUUID()
        chatId?: string

    @ApiPropertyOptional({ type: String, example: '3+0' })
    @IsOptional()
    @IsString()
        timeControl?: string

    @ApiPropertyOptional({ type: String, example: 'Blitz game' })
    @IsOptional()
    @IsString()
        event?: string

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
        site?: string

    @ApiPropertyOptional({ type: String, example: 'Queen\'s Gambit Declined: Marshall Defense'  })
    @IsOptional()
    @IsString()
        opening?: string

    @ApiPropertyOptional({ type: String, example: 'Time forfeit' })
    @IsOptional()
    @IsString()
        termination?: string

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
        annotator?: string

    @ApiPropertyOptional({ type: Date })
    @IsOptional()
    @IsString()
        startDate?: Date

    @ApiPropertyOptional({ type: Date })
    @IsOptional()
    @IsString()
        endDate?: Date

}