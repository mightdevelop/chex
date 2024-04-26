import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateGameDto {

    @ApiPropertyOptional({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsOptional()
    @IsUUID()
        whiteId?: string

    @ApiPropertyOptional({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsOptional()
    @IsUUID()
        blackId?: string

    @ApiPropertyOptional({ type: String, example: '3+0' })
    @IsOptional()
    @IsString()
        timeControl?: string

    @ApiPropertyOptional({ type: String, example: 'Blitz game' })
    @IsOptional()
    @IsString()
        event?: string

}