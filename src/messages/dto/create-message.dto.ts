import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class CreateMessageDto {

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        userId: string

    @ApiProperty({ type: String, format: 'uuid', example: 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' })
    @IsUUID()
        chatId: string

    @ApiProperty({ type: String, example: 'Hello!' })
    @IsString()
        content: string

}