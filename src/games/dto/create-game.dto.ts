import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateGameDto {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        whiteId: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        blackId: string

    @ApiProperty({ type: String, example: '180+0' })
    @IsString()
        timeControl: string

    @ApiPropertyOptional({ type: String, example: 'Rated Blitz game' })
    @IsOptional()
    @IsString()
        event?: string

}