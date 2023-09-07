import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common'
import { GamesService } from './games.service'
import { Game } from './models/games.model'
import { CreateGameDto } from './dto/create-game.dto'
import { GameIdDto } from 'src/games/dto/game-id.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AdminGuard } from 'src/common/guards/admin.guard'


@ApiTags('games')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/games')
export class GamesController {

    constructor(
        private readonly gamesService: GamesService,
    ) {}

    @Get('/')
    @UseGuards(AdminGuard)
    async getGames(): Promise<Game[]> {
        const games: Game[] = await this.gamesService.getGames()
        return games
    }

    @Get('/:gameId')
    async getGameById(
        @Param() { gameId }: GameIdDto,
    ): Promise<Game> {
        const game: Game = await this.gamesService.getGameById(gameId)
        if (!game)
            throw new NotFoundException({ message: 'Game not found' })
        return game
    }

    @Post('/')
    @UseGuards(AdminGuard)
    async createGame(
        @Body() dto: CreateGameDto,
    ): Promise<Game> {
        const game: Game = await this.gamesService.createGame(dto)
        return game
    }

    @Delete('/:gameId')
    @UseGuards(AdminGuard)
    async deleteGame(
        @Param() { gameId }: GameIdDto,
    ): Promise<Game> {
        const game: Game = await this.gamesService.deleteGame(gameId)
        if (!game)
            throw new NotFoundException({ message: 'Game not found' })
        return game
    }

}