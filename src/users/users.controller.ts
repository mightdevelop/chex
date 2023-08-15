import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from './models/users.model'
import { CreateUserDto } from './dto/create-user.dto'
import { UserIdDto } from 'src/users/dto/user-id.dto'
import { isAdmin } from 'src/auth/decorators/is-admin.decorator'
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'


// @ApiTags('users')
// @ApiBearerAuth('jwt')
// @UseGuards(JwtAuthGuard)
@Controller('/users')
export class UsersController {

    constructor(
        private usersService: UsersService,
    ) {}

    @Get('/')
    @isAdmin()
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

    // @Get('/:userId/friends')
    // @isAdmin()
    // async getFriendsByUserId(
    //     @Param() { userId }: UserIdDto,
    //     @Query() { offset }: PartialOffsetDto,
    // ): Promise<User[]> {
    //     const user = await this.usersService.getUserById(userId)
    //     if (!user)
    //         throw new NotFoundException({ message: 'User not found' })
    //     const friends: User[] = await this.usersService.getFriendsByUserId(
    //         userId, 30, offset ? Number(offset) : undefined
    //     )
    //     return friends
    // }

    @Post('/')
    @isAdmin()
    async createUser(
        @Body() dto: CreateUserDto,
    ): Promise<User> {
        const user: User = await this.usersService.createUser(dto)
        return user
    }

    @Delete('/:userId')
    @isAdmin()
    async deleteUser(
        @Param() { userId }: UserIdDto,
    ): Promise<User> {
        const user: User = await this.usersService.deleteUser(userId)
        if (!user)
            throw new NotFoundException({ message: 'User not found' })
        return user
    }

}