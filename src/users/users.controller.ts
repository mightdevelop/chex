import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    // ForbiddenException,
    // Put,
    // UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from './models/users.model'
import { CreateUserDto } from './dto/create-user.dto'
import { UserIdDto } from 'src/users/dto/user-id.dto'
// import { isAdmin } from 'src/auth/decorators/isAdmin.decorator'
// import { AdminGuard } from 'src/auth/guards/admin.guard'
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
// import { PartialOffsetDto } from './dto/partial-offset.dto'


// @ApiTags('users')
// @ApiBearerAuth('jwt')
// @UseGuards(JwtAuthGuard)
@Controller('/users')
export class UsersController {

    constructor(
        private usersService: UsersService,
    ) {}

    @Get('/')
    // @isAdmin()
    // @UseGuards(AdminGuard)
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
    // @UseGuards(AdminGuard)
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
    // @isAdmin()
    // @UseGuards(AdminGuard)
    async createUser(
        @Body() dto: CreateUserDto,
    ): Promise<User> {
        const user: User = await this.usersService.createUser(dto)
        return user
    }

    @Delete('/:userId')
    // @isAdmin()
    // @UseGuards(AdminGuard)
    async deleteUser(
        @Param() { userId }: UserIdDto,
    ): Promise<User> {
        const user: User = await this.usersService.deleteUser(userId)
        if (!user)
            throw new NotFoundException({ message: 'User not found' })
        return user
    }

}