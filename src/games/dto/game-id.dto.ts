import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class GameIdDto {

    @ApiProperty({ type: String, format: '11 char nanoid string', example: 'Vtybm0S3zre' })
    @IsString()
        gameId: string

}