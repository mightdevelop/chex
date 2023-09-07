import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync, hashSync } from 'bcrypt'
import { UsersService } from 'src/users/users.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User } from 'src/users/models/users.model'
import { ValidateUserDto } from './dto/validate-user.dto'
import { TokenPayload } from './types/token-payload'
import { Cache } from 'cache-manager'
import { TokensDto } from './dto/tokens.dto'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'


@Injectable()
export class AuthService {

    constructor(
        @Inject(CACHE_MANAGER) private store: Cache,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: CreateUserDto): Promise<TokensDto> {
        const candidate: User = await this.usersService.getUserByEmail(dto.email)
        if (candidate) {
            throw new BadRequestException({ message: 'This email is already used' })
        }
        const hashPassword = hashSync(dto.password, 7)
        const user: User = await this.usersService.createUser({ ...dto, password: hashPassword })
        if (user) {
            const tokens: TokensDto = await this.generateTokens(user)
            return tokens
        }
        throw new InternalServerErrorException({ message: 'Internal registration server error' })
    }

    async login(dto: ValidateUserDto): Promise<TokensDto> {
        const user: User = await this.validateUser(dto)
        if (user) {
            const tokens: TokensDto = await this.generateTokens(user)
            return tokens
        }
        throw new InternalServerErrorException({ message: 'Internal login server error' })
    }

    async refresh(refreshToken: string): Promise<TokensDto> {
        const data: TokenPayload = this.jwtService.decode(refreshToken) as TokenPayload
        const userId = data.id
        const user: User = await this.usersService.getUserById(userId)
        const isRefreshTokenMatches: boolean =
            await this.isRefreshTokenMatches(refreshToken, userId)
        if (!isRefreshTokenMatches)
            throw new UnauthorizedException({ message: 'Invalid refresh token' })
        const tokens: TokensDto = await this.generateTokens(user)
        if (!tokens)
            throw new UnauthorizedException({ message: 'Refresh server error' })
        return tokens
    }

    async logout(userId: string): Promise<void> {
        await this.store.del(userId)
    }

    async generateTokens(user: User): Promise<TokensDto> {
        const { id, username, isAdmin }: TokenPayload = user
        const iat: number = Math.ceil(Date.now() / 1000)
        const tokens: TokensDto = {
            accessToken: this.jwtService.sign({
                id,
                username,
                isAdmin,
                iat,
                exp: iat + Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRESIN'))
            }, { secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET') }),
            refreshToken: this.jwtService.sign({
                id,
                username,
                isAdmin,
                iat,
                exp: iat + Number(this.configService.get('JWT_REFRESH_TOKEN_EXPIRESIN'))
            }, { secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET') }),
        }
        if (tokens) {
            await this.store.set(user.id, tokens.refreshToken)
            return tokens
        }
        throw new InternalServerErrorException({ message: 'Internal generate tokens server error' })
    }

    async validateUser(dto: ValidateUserDto): Promise<User> {
        const user: User = await this.usersService.getUserByEmail(dto.email)
        if (!user)
            throw new UnauthorizedException({ message: 'Wrong email' })
        const passwordIsValid: boolean = compareSync(dto.password, user.password)
        if (user && passwordIsValid)
            return user
        throw new UnauthorizedException({ message: 'Wrong password' })
    }

    async isRefreshTokenMatches(
        refreshTokenFromRequest: string,
        userId: string
    ): Promise<boolean> {
        const refreshTokenFromStore = await this.store.get(userId)
        return refreshTokenFromRequest === refreshTokenFromStore
    }

}