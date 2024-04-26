import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class JoinGameDto {

    @ApiProperty({ type: String, format: '11 char nanoid string', example: 'Vtybm0S3zre' })
    @IsString()
        gameId: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        userId: string

}