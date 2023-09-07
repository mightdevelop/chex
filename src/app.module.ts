import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './users/models/users.model'
import { AuthModule } from './auth/auth.module'
import { GamesModule } from './games/games.module'
import { Game } from './games/models/games.model'
import { Move } from './moves/models/moves.model'
import { GatewayModule } from './gateway/gateway.module'

@Module({
    imports: [
        UsersModule,
        AuthModule,
        GamesModule,
        GatewayModule,
        ConfigModule.forRoot({
            envFilePath: '@.env',
            isGlobal: true
        }),
        SequelizeModule.forRootAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: async (configService: ConfigService) => ({
                dialect: 'postgres',
                host: configService.get('POSTGRES_HOST'),
                port: Number(configService.get('POSTGRES_PORT')),
                username: configService.get('POSTGRES_USER'),
                password: String(configService.get('POSTGRES_PASSWORD')),
                database: configService.get('POSTGRES_DB'),
                models: [
                    User,
                    Game,
                    Move,
                ],
                autoLoadModels: true,
                retryAttempts: 0
            })
        }),
    ],
})
export class AppModule {}
