import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, Includeable, DestroyOptions } from 'sequelize'
import { Move } from './models/moves.model'
import { GamesService } from 'src/games/games.service'
import { CreateMoveDto } from './dto/create-move.dto'
import { Game } from 'src/games/models/games.model'
import { Chess, Move as ChessMove } from 'chess.js'
import { Color } from './types/color.enum'


@Injectable()
export class MovesService {

    constructor(
        @InjectModel(Move) private readonly moveRepository: typeof Move,
        private readonly gamesService: GamesService,
    ) {}

    async getMoves(
        limit?: number,
        offset?: number,
        include?: Includeable | Includeable[],
    ): Promise<Move[]> {
        const moves: Move[] = await this.moveRepository.findAll({ limit, offset, include })
        return moves
    }

    async getMoveById(
        moveId: string,
        include?: Includeable | Includeable[],
    ): Promise<Move> {
        const move: Move = await this.moveRepository.findByPk(moveId, { include })
        return move
    }

    async getMovesByIdsArray(
        movesIds: string[],
        include?: Includeable | Includeable[],
    ): Promise<Move[]> {
        const moves: Move[] = await this.moveRepository.findAll({
            where: { [Op.or]: { id: movesIds } },
            include,
        })
        return moves
    }

    async getMovesByGameId(
        gameId: string,
        include?: Includeable | Includeable[],
    ): Promise<Move[]> {
        const moves: Move[] = await this.moveRepository.findAll({ where: { gameId }, include })
        return moves
    }

    async move(
        dto: CreateMoveDto
    ): Promise<Move> {
        const { chessMove, fen } = await this.validateMove(dto)
        dto.playerColor = chessMove.color
        const move: Move = await this.createMove(dto)
        await this.gamesService.updateGame({ gameId: dto.gameId, fen })
        return move
    }

    private async validateMove(
        dto: CreateMoveDto
    ): Promise<{ chessMove: ChessMove, fen: string }> {
        const game: Game = await this.gamesService.getGameById(dto.gameId)
        const chess = new Chess(game.fen)

        const turn = chess.turn()

        if (turn === Color.WHITE && dto.playerId !== game.whiteId) {
            throw new ForbiddenException('It\'s not your turn')
        } else if (turn === Color.BLACK && dto.playerId !== game.blackId) {
            throw new ForbiddenException('It\'s not your turn')
        }

        try {
            return { chessMove: chess.move(dto.notation), fen: chess.fen() }
        } catch {
            throw new BadRequestException('Invalid move')
        }
    }

    private async createMove(
        dto: CreateMoveDto
    ): Promise<Move> {
        const moves: Move[] = await this.moveRepository.findAll({ where: {
            gameId: dto.gameId,
            playerColor: dto.playerColor,
        } })
        let sequenceNumber: number
        if (!moves.length) {
            sequenceNumber = moves.pop().sequenceNumber + 1
        } else {
            sequenceNumber = 1
        }
        const move: Move = await this.moveRepository.create({
            ...dto,
            sequenceNumber
        })
        return move
    }

    async deleteMove(
        moveId: string,
        options?: DestroyOptions,
    ): Promise<Move> {
        const move: Move = await this.moveRepository.findByPk(moveId)
        if (!move)
            throw new NotFoundException('Move not found')

        await this.moveRepository.destroy({ where: { id: moveId }, ...options })
        return move
    }

}