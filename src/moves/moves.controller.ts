import {
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    UseGuards,
} from '@nestjs/common'
import { MovesService } from './moves.service'
import { Move } from './models/moves.model'
import { MoveIdDto } from 'src/moves/dto/move-id.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AdminGuard } from 'src/common/guards/admin.guard'

@ApiTags('moves')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/moves')
export class MovesController {

    constructor(
        private readonly movesService: MovesService,
    ) {}

    @Get('/')
    @UseGuards(AdminGuard)
    async getMoves(): Promise<Move[]> {
        const moves: Move[] = await this.movesService.getMoves()
        return moves
    }

    @Get('/:moveId')
    async getMoveById(
        @Param() { moveId }: MoveIdDto,
    ): Promise<Move> {
        const move: Move = await this.movesService.getMoveById(moveId)
        if (!move)
            throw new NotFoundException({ message: 'Move not found' })
        return move
    }

    @Delete('/:moveId')
    @UseGuards(AdminGuard)
    async deleteMove(
        @Param() { moveId }: MoveIdDto,
    ): Promise<Move> {
        const move: Move = await this.movesService.deleteMove(moveId)
        if (!move)
            throw new NotFoundException({ message: 'Move not found' })
        return move
    }

}