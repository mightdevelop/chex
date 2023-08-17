import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class UserIdListDto {

    @ApiProperty({ type: Array<string>, format: 'uuid', example: [ 'ff1a1780-aff9-45c9-8025-714fb78b2cb1' ] })
    @IsUUID(4, { each: true })
        userIdList: string[]

}