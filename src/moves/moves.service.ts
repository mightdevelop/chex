import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
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

    async getMoves(limit?: number, offset?: number): Promise<Move[]> {
        const moves: Move[] = await this.moveRepository.findAll({ limit, offset })
        return moves
    }

    async getMoveById(
        moveId: string
    ): Promise<Move> {
        const move: Move = await this.moveRepository.findByPk(moveId)
        return move
    }

    async getMovesByIdsArray(
        movesIds: string[]
    ): Promise<Move[]> {
        const moves: Move[] = await this.moveRepository.findAll({ where: { [Op.or]: { id: movesIds } } })
        return moves
    }

    async getMovesByGameId(
        gameId: string
    ): Promise<Move[]> {
        const moves: Move[] = await this.moveRepository.findAll({ where: { gameId } })
        return moves
    }

    async move(
        dto: CreateMoveDto
    ): Promise<Move> {
        const chessMove: ChessMove = await this.validateMove(dto)
        dto.playerColor = chessMove.color
        const move: Move = await this.createMove(dto)
        return move
    }

    async validateMove(
        dto: CreateMoveDto
    ): Promise<ChessMove> {
        const game: Game = await this.gamesService.getGameById(dto.gameId)
        const chess = new Chess(game.position)

        const turn = chess.turn()

        if (turn === Color.WHITE && dto.playerId !== game.whiteId) {
            throw new ForbiddenException('It\'s not your turn')
        } else if (turn === Color.BLACK && dto.playerId !== game.blackId) {
            throw new ForbiddenException('It\'s not your turn')
        }

        try {
            return chess.move(dto.notation)
        } catch {
            throw new BadRequestException('Invalid move')
        }
    }

    async createMove(
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
        moveId: string
    ): Promise<Move> {
        const move: Move = await this.moveRepository.findByPk(moveId)
        if (!move)
            throw new NotFoundException('Move not found')

        await move.destroy()
        return move
    }

}