import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsUUID } from 'class-validator'

export class CreateChatDto {

    @ApiProperty({ type: Array<string>, format: 'uuid', example: [ 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' ] })
    @IsArray({ each: true })
    @IsUUID()
        userIdList: string[]

}