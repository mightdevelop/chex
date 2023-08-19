import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './users/models/users.model'
import { AuthModule } from './auth/auth.module'
import { SocketIoModule } from './socketio/socketio.module'

@Module({
    imports: [
        UsersModule,
        AuthModule,
        SocketIoModule,
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
                ],
                autoLoadModels: true,
                retryAttempts: 0
            })
        }),
    ],
})
export class AppModule {}
