import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './models/users.model'
import { UsersGateway } from './users.gateway'
import { JwtModule } from '@nestjs/jwt'

@Module({
    imports: [
        SequelizeModule.forFeature([ User ]),
        JwtModule.register({}),
    ],
    controllers: [ UsersController ],
    providers: [ UsersService, UsersGateway ],
    exports: [ UsersService ],
})
export class UsersModule {}
