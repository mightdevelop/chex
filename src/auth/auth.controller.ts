import { Body, Controller, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { ValidateUserDto } from './dto/validate-user.dto'
import { TokensDto } from './dto/tokens.dto'
import { ApiTags } from '@nestjs/swagger'
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { CurrentUser } from './decorators/current-user.decorator'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { Response } from './types/response'
import { ConfigService } from '@nestjs/config'
import { serialize } from 'cookie'

@ApiTags('auth')
@Controller('/auth')
export class AuthController {

    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {}

    @Post('/register')
    async register(
        @Res() res: Response,
        @Body() dto: CreateUserDto,
    ): Promise<TokensDto> {
        const tokens: TokensDto = await this.authService.register(dto)
        res.setHeader('Set-Cookie', serialize('accessToken', tokens.accessToken, {
            httpOnly: true,
            maxAge: Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRESIN')) * 1000
        }))
        res.status(200).json(tokens)
        return tokens
    }

    @Post('/login')
    async login(
        @Res() res: Response,
        @Body() dto: ValidateUserDto,
    ): Promise<void> {
        const tokens: TokensDto = await this.authService.login(dto)
        res.cookie('authTokens', tokens, {
            httpOnly: true,
            // maxAge: Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRESIN')) * 1000,
            maxAge: 100000,
            // sameSite: 'none',
            path: '/',
            secure: true,
        })
        // res.setHeader('Set-Cookie', serialize('accessToken', tokens.accessToken, {
        //     httpOnly: true,
        //     maxAge: Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRESIN')) * 1000,
        //     sameSite: 'none',
        //     secure: true,
        // }))
        res.status(200)
    }

    @Post('/refresh')
    @UseGuards(JwtRefreshGuard)
    async refresh(
        @Body() { refreshToken }: RefreshTokenDto,
    ): Promise<TokensDto> {
        const tokens: TokensDto = await this.authService.refresh(refreshToken)
        if (!tokens)
            throw new UnauthorizedException({ message: 'Refresh token server error' })
        return tokens
    }

    @Post('/logout')
    @UseGuards(JwtAuthGuard)
    async logout(
        @Res() res: Response,
        @CurrentUser() { id },
    ): Promise<void> {
        await this.authService.logout(id)
        res.setHeader('Set-Cookie', serialize('accessToken', '', { expires: new Date() }))
        res.status(200).send()
    }

}