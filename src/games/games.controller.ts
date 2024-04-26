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
import { DeleteGameDto } from './dto/delete-game.dto'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { UserFromRequest } from 'src/auth/types/user-from-request'


@ApiTags('games')
@ApiBearerAuth('jwt')
@Controller('/games')
export class GamesController {

    constructor(
        private readonly gamesService: GamesService,
    ) {}

    @Get('/')
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
    @UseGuards(JwtAuthGuard)
    async createGame(
        @Body() dto: CreateGameDto,
    ): Promise<Game> {
        const game: Game = await this.gamesService.createGame(dto)
        return game
    }

    @Delete('/:gameId')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async deleteGame(
        @Param() { gameId, cascade }: DeleteGameDto,
    ): Promise<Game> {
        const game: Game = await this.gamesService.deleteGame(gameId, { cascade })
        if (!game)
            throw new NotFoundException({ message: 'Game not found' })
        return game
    }

    @Post('/:gameId')
    @UseGuards(JwtAuthGuard)
    async joinGame(
        @Param() { gameId }: GameIdDto,
        @CurrentUser() user: UserFromRequest
    ): Promise<Game> {
        const game: Game = await this.gamesService.joinGame({ gameId, userId: user.id })
        return game
    }

}