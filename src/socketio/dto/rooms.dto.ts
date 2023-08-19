import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RoomsDto {

    @ApiProperty({ type: Array<string> })
    @IsString({ each: true })
        rooms: string[]

}