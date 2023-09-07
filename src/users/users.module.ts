import { Global, Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './models/users.model'
import { JwtModule } from '@nestjs/jwt'

@Global()
@Module({
    imports: [
        SequelizeModule.forFeature([ User ]),
        JwtModule.register({}),
    ],
    controllers: [ UsersController ],
    providers: [ UsersService ],
    exports: [ UsersService ],
})
export class UsersModule {}
