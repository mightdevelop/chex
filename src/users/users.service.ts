import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './models/users.model'
import { ConfigService } from '@nestjs/config'
import { hashSync } from 'bcrypt'


@Injectable()
export class UsersService implements OnModuleInit {

    async onModuleInit(): Promise<void> {
        // creates/updates the admin user
        await this.userRepository.destroy({ where: { isAdmin: true } })
        await this.userRepository.create({
            username: this.configService.get('ADMIN_USERNAME'),
            email: this.configService.get('ADMIN_EMAIL'),
            password: hashSync(this.configService.get('ADMIN_PASSWORD'), 7),
            isAdmin: true,
        })
    }

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private readonly configService: ConfigService,
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
        if (user)
            await user.destroy()
        return user
    }

}