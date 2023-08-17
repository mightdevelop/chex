import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './models/users.model'
import { ConfigService } from '@nestjs/config'
import { hashSync } from 'bcrypt'
import { Socket } from 'socket.io'
import { TokenPayload } from 'src/auth/types/token-payload'
import { JwtService } from '@nestjs/jwt'


@Injectable()
export class UsersService implements OnModuleInit {

    async onModuleInit(): Promise<void> {
        // creates/updates the admin user
        if (this.configService.get('UPDATE_ADMIN') == true) {
            await this.userRepository.destroy({ where: { isAdmin: true } })
            await this.userRepository.create({
                username: this.configService.get('ADMIN_USERNAME'),
                email: this.configService.get('ADMIN_EMAIL'),
                password: hashSync(this.configService.get('ADMIN_PASSWORD'), 7),
                isAdmin: true,
            })
        }
    }

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async getUsers(limit?: number, offset?: number): Promise<User[]> {
        const users: User[] = await this.userRepository.findAll({ limit, offset })
        return users
    }

    async getUserById(
        userId: string
    ): Promise<User> {
        const user: User = await this.userRepository.findByPk(userId)
        return user
    }

    async getUsersByIdsArray(
        usersIds: string[]
    ): Promise<User[]> {
        const users: User[] = await this.userRepository.findAll({ where: { [Op.or]: { id: usersIds } } })
        return users
    }

    async getUserByUsername(
        username: string
    ): Promise<User> {
        const user: User = await this.userRepository.findOne({ where: { username } })
        return user
    }

    async getUserByEmail(
        email: string
    ): Promise<User> {
        const user: User = await this.userRepository.findOne({ where: { email } })
        return user
    }

    async createUser(
        dto: CreateUserDto
    ): Promise<User> {
        const user: User = await this.userRepository.create(dto)
        return user
    }

    async deleteUser(
        userId: string
    ): Promise<User> {
        const user: User = await this.userRepository.findByPk(userId)
        if (!user)
            throw new NotFoundException('User not found')

        await user.destroy()
        return user
    }

    async updateUserLastSeenOnline(
        userId: string
    ): Promise<User> {
        const user: User = await this.userRepository.findByPk(userId)
        if (!user)
            throw new NotFoundException('User not found')

        user.lastSeen = new Date(Date.now())
        await user.save()
        return user
    }

    async getUserIdFromSocket(
        socket: Socket
    ): Promise<string> {
        const jwtToken: string = socket.handshake.headers.authorization.split(' ')[1]
        const tokenPayload: TokenPayload = this.jwtService.decode(jwtToken) as TokenPayload
        return tokenPayload.id
    }

    // async getUserFromSocket(
    //     socket: Socket
    // ): Promise<User> {
    //     const userId: string = await this.getUserIdFromSocket(socket)
    //     const user: User = await this.userRepository.findByPk(userId)
    //     return user
    // }

}