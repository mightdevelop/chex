import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { CreateGameDto } from './dto/create-game.dto'
import { Game } from './models/games.model'
import { nanoid } from 'nanoid'
import { UpdateFenDto } from './dto/update-fen.dto'


@Injectable()
export class GamesService {

    constructor(
        @InjectModel(Game) private gameRepository: typeof Game,
    ) {}

    async getGames(limit?: number, offset?: number): Promise<Game[]> {
        const games: Game[] = await this.gameRepository.findAll({ limit, offset })
        return games
    }

    async getGameById(
        gameId: string
    ): Promise<Game> {
        const game: Game = await this.gameRepository.findByPk(gameId)
        return game
    }

    async getGamesByIdsArray(
        gamesIds: string[]
    ): Promise<Game[]> {
        const games: Game[] = await this.gameRepository.findAll({ where: { [Op.or]: { id: gamesIds } } })
        return games
    }

    async getGamesByPlayerId(
        playerId: string
    ): Promise<Game[]> {
        const games: Game[] = await this.gameRepository.findAll({ where: { [Op.or]: [
            { whiteId: playerId, },
            { blackId: playerId, },
        ] } })
        return games
    }

    async getGamesByWhiteId(
        whiteId: string
    ): Promise<Game[]> {
        const games: Game[] = await this.gameRepository.findAll({ where: { whiteId } })
        return games
    }

    async getGamesByBlackId(
        blackId: string
    ): Promise<Game[]> {
        const games: Game[] = await this.gameRepository.findAll({ where: { blackId } })
        return games
    }

    async createGame(
        dto: CreateGameDto
    ): Promise<Game> {
        const game: Game = await this.gameRepository.create({
            id: nanoid(11),
            ...dto,
        })
        return game
    }

    async deleteGame(
        gameId: string
    ): Promise<Game> {
        const game: Game = await this.gameRepository.findByPk(gameId)
        if (!game)
            throw new NotFoundException('Game not found')

        await game.destroy()
        return game
    }

    async updateFen(
        { gameId, fen }: UpdateFenDto
    ): Promise<Game> {
        const game: Game = await this.gameRepository.findByPk(gameId)
        if (!game)
            throw new NotFoundException('Game not found')

        game.fen = fen
        await game.save()
        return game
    }

}