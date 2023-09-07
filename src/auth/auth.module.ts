import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { create as redisStore } from 'cache-manager-redis-store'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtAuthStrategy } from 'src/auth/strategies/jwt-auth.strategy'
import { JwtRefreshStrategy } from 'src/auth/strategies/jwt-refresh-strategy'
import { SocketIoJwtAuthStrategy } from 'src/auth/strategies/socket-io-jwt-auth.strategy'


@Module({
    controllers: [ AuthController ],
    providers: [
        AuthService,
        JwtAuthStrategy,
        JwtRefreshStrategy,
        SocketIoJwtAuthStrategy,
    ],
    imports: [
        CacheModule.registerAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
                ttl: Number(configService.get('JWT_REFRESH_TOKEN_EXPIRESIN')) // 30 days refresh token
            }),
        }),
        JwtModule.register({}),
    ],
    exports: [ AuthService ],
})

export class AuthModule {}