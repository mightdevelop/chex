import { Body, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { ValidateUserDto } from './dto/validate-user.dto'
import { TokensDto } from './dto/tokens.dto'
import { ApiTags } from '@nestjs/swagger'
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { CurrentUser } from './decorators/current-user.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'

@ApiTags('auth')
@Controller('/auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('/register')
    async register(
        @Body() dto: CreateUserDto,
    ): Promise<TokensDto> {
        const tokens: TokensDto = await this.authService.register(dto)
        return tokens
    }

    @Post('/login')
    async login(
        @Body() dto: ValidateUserDto,
    ): Promise<TokensDto> {
        const tokens: TokensDto = await this.authService.login(dto)
        return tokens
    }

    @Post('/refresh')
    @UseGuards(JwtRefreshGuard)
    async refresh(
        @Body() { refreshToken }: RefreshTokenDto,
    ): Promise<TokensDto> {
        const tokens: TokensDto = await this.authService.refresh(refreshToken)
        if (!tokens)
            throw new UnauthorizedException({ message: 'Refresh server error' })
        return tokens
    }

    @Post('/logout')
    @UseGuards(JwtAuthGuard)
    async logout(
        @CurrentUser() { id },
    ): Promise<void> {
        await this.authService.logout(id)
    }

}