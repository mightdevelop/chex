import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, Includeable, DestroyOptions } from 'sequelize'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './models/users.model'
import { ConfigService } from '@nestjs/config'
import { hashSync } from 'bcrypt'
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
        @InjectModel(User) private readonly userRepository: typeof User,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async getUsers(
        limit?: number,
        offset?: number,
        include?: Includeable | Includeable[],
    ): Promise<User[]> {
        const users: User[] = await this.userRepository.findAll({ limit, offset, include })
        return users
    }

    async getUserById(
        userId: string,
        include?: Includeable | Includeable[],
    ): Promise<User> {
        const user: User = await this.userRepository.findByPk(userId, { include })
        return user
    }

    async getUsersByIdsArray(
        usersIds: string[],
        include?: Includeable | Includeable[],
    ): Promise<User[]> {
        const users: User[] = await this.userRepository.findAll({
            where: { [Op.or]: { id: usersIds } },
            include,
        })
        return users
    }

    async getUserByUsername(
        username: string,
        include?: Includeable | Includeable[],
    ): Promise<User> {
        const user: User = await this.userRepository.findOne({ where: { username }, include })
        return user
    }

    async getUserByEmail(
        email: string,
        include?: Includeable | Includeable[],
    ): Promise<User> {
        const user: User = await this.userRepository.findOne({ where: { email }, include })
        return user
    }

    async createUser(
        dto: CreateUserDto
    ): Promise<User> {
        const user: User = await this.userRepository.create(dto)
        return user
    }

    async deleteUser(
        userId: string,
        options?: DestroyOptions,
    ): Promise<User> {
        const user: User = await this.userRepository.findByPk(userId)
        if (!user)
            throw new NotFoundException('User not found')

        await this.userRepository.destroy({ where: { id: userId }, ...options })
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

}