import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsUUID } from 'class-validator'

export class RoomsDto {

    @ApiProperty({ type: Array<string> })
    @IsArray({ each: true })
    @IsUUID()
        rooms: string[]

}