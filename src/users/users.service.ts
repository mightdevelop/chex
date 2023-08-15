import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './models/users.model'


@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
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