import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, Includeable, DestroyOptions } from 'sequelize'
import { CreateGameDto } from './dto/create-game.dto'
import { Game } from './models/games.model'
import { nanoid } from 'nanoid'
import { UpdateGameDto } from './dto/update-game.dto'
import { Chat } from 'src/chats/models/chats.model'
import { ChatsService } from 'src/chats/chats.service'
import { Message } from 'src/messages/models/messages.model'
import { JoinGameDto } from './dto/join-game.dto'
import { User } from 'src/users/models/users.model'


@Injectable()
export class GamesService {

    constructor(
        @InjectModel(Game)
        private gameRepository: typeof Game,
        @Inject(forwardRef(() => ChatsService))
        private readonly chatsService: ChatsService,
    ) {}

    async getGames(
        limit?: number,
        offset?: number,
        include?: Includeable | Includeable[],
    ): Promise<Game[]> {
        const games: Game[] = await this.gameRepository.findAll({ limit, offset, include })
        return games
    }

    async getGameById(
        gameId: string,
        include?: Includeable | Includeable[],
    ): Promise<Game> {
        const game: Game = await this.gameRepository.findByPk(gameId, { include })
        return game
    }

    async getGamesByIdsArray(
        gamesIds: string[],
        include?: Includeable | Includeable[],
    ): Promise<Game[]> {
        const games: Game[] = await this.gameRepository.findAll({
            where: { [Op.or]: { id: gamesIds } },
            include,
        })
        return games
    }

    async getGamesByPlayerId(
        playerId: string,
        include?: Includeable | Includeable[],
    ): Promise<Game[]> {
        const games: Game[] = await this.gameRepository.findAll({
            where: { [Op.or]: [
                { whiteId: playerId, },
                { blackId: playerId, },
            ] },
            include
        })
        return games
    }

    async getGamesByWhiteId(
        whiteId: string,
        include?: Includeable | Includeable[],
    ): Promise<Game[]> {
        const games: Game[] = await this.gameRepository.findAll({ where: { whiteId }, include })
        return games
    }

    async getGamesByBlackId(
        blackId: string,
        include?: Includeable | Includeable[],
    ): Promise<Game[]> {
        const games: Game[] = await this.gameRepository.findAll({ where: { blackId }, include })
        return games
    }

    async createGame(
        dto: CreateGameDto
    ): Promise<Game> {
        const chat: Chat = await this.chatsService.createChat({ userIdList: [ dto.whiteId, dto.blackId ] })
        const game: Game = await this.gameRepository.create({
            id: nanoid(11),
            chatId: chat.id,
            ...dto,
        })
        return game
    }

    async updateGame(
        dto: UpdateGameDto
    ): Promise<Game> {
        const game: Game = await this.gameRepository.findByPk(dto.gameId)
        if (!game)
            throw new NotFoundException('Game not found')

        game.fen = dto.fen
        game.whiteId = dto.whiteId
        game.blackId = dto.blackId
        game.chatId = dto.chatId
        game.timeControl = dto.timeControl
        game.event = dto.event
        game.site = dto.site
        game.opening = dto.opening
        game.termination = dto.termination
        game.annotator = dto.annotator
        game.endDate = dto.endDate
        await game.save()
        return game
    }

    async joinGame(
        { gameId, userId }: JoinGameDto
    ): Promise<Game> {
        let game: Game = await this.getGameById(gameId)

        await this.chatsService.joinChat({ chatId: game.chatId, userIdList: [ userId ] })

        game = await this.getGameById(gameId, [
            { model: Chat, include: [ Message ] },
            { model: User },
        ])

        game.whiteId ? game.blackId = userId : game.whiteId = userId
        game.save()

        return game
    }

    async deleteGame(
        gameId: string,
        options?: DestroyOptions,
    ): Promise<Game> {
        const game: Game = await this.gameRepository.findByPk(gameId)
        if (!game)
            throw new NotFoundException('Game not found')

        await this.gameRepository.destroy({ where: { id: gameId }, ...options })
        await this.chatsService.deleteChat(game.chatId)
        return game
    }

}