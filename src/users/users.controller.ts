import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from './models/users.model'
import { CreateUserDto } from './dto/create-user.dto'
import { UserIdDto } from 'src/users/dto/user-id.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AdminGuard } from 'src/common/guards/admin.guard'


@ApiTags('users')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('/users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get('/')
    @UseGuards(AdminGuard)
    async getUsers(): Promise<User[]> {
        const users: User[] = await this.usersService.getUsers()
        return users
    }

    @Get('/:userId')
    async getUserById(
        @Param() { userId }: UserIdDto,
    ): Promise<User> {
        const user: User = await this.usersService.getUserById(userId)
        if (!user)
            throw new NotFoundException({ message: 'User not found' })
        return user
    }

    @Post('/')
    @UseGuards(AdminGuard)
    async createUser(
        @Body() dto: CreateUserDto,
    ): Promise<User> {
        const user: User = await this.usersService.createUser(dto)
        return user
    }

    @Delete('/:userId')
    @UseGuards(AdminGuard)
    async deleteUser(
        @Param() { userId }: UserIdDto,
    ): Promise<User> {
        const user: User = await this.usersService.deleteUser(userId)
        if (!user)
            throw new NotFoundException({ message: 'User not found' })
        return user
    }

}