import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { TokenPayload } from 'src/auth/types/token-payload'
import { UsersService } from 'src/users/users.service'
import { UserFromRequest } from '../types/user-from-request'
import { User } from 'src/users/models/users.model'

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private usersService: UsersService,
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
        const { id,username,email,isAdmin }: UserFromRequest = user
        return { id, username, email, isAdmin }
    }
}
