import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class DeleteGameDto {

    @ApiProperty({ type: String, format: '11 char nanoid string', example: 'Vtybm0S3zre' })
    @IsString()
        gameId: string

    @ApiPropertyOptional({ type: Boolean, format: 'boolean', example: true })
    @IsOptional()
    @IsBoolean()
        cascade?: boolean

}