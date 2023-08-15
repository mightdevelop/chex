import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './users/models/users.model'
import { APP_GUARD } from '@nestjs/core'
import { AdminGuard } from './auth/guards/admin.guard'

@Module({
    imports: [
        UsersModule,
        ConfigModule.forRoot({
            envFilePath: '@.env'
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: String(process.env.POSTGRES_PASSWORD),
            database: process.env.POSTGRES_DB,
            models: [
                User,
            ],
            autoLoadModels: true,
            retryAttempts: 0
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AdminGuard
        }
    ]
})
export class AppModule {}
