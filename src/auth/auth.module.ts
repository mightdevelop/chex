import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtAuthStrategy } from 'src/auth/strategies/jwt-auth.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy'
import { create as redisStore } from 'cache-manager-redis-store'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersModule } from 'src/users/users.module'
import { SocketIoJwtAuthStrategy } from './strategies/socket-io-jwt-auth.strategy'


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
        UsersModule,
    ],
    exports: [ AuthService ],
})

export class AuthModule {}