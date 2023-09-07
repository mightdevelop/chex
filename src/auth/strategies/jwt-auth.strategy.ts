import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { TokenPayload } from 'src/auth/types/token-payload'
import { UsersService } from 'src/users/users.service'
import { User } from 'src/users/models/users.model'
import { UserFromRequest } from 'src/auth/types/user-from-request'

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
        })
    }
    async validate(payload: TokenPayload): Promise<UserFromRequest> {
        const user: User = await this.usersService.getUserById(payload.id)
        if (!user)
            return null
        const { id, username, email, isAdmin }: UserFromRequest = user
        return { id, username, email, isAdmin }
    }
}
