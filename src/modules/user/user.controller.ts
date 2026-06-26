import { Controller, Delete, Get, Param, Request, Query, UseGuards, Body, Post, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';
import { GetUsersFiltersDto } from './dto/user.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Patch('updatePassword')
    updatePassword(
        @Request() req: any,
        @Query('newPassword') newPassword: string,
        @Query('oldPassword') oldPassword: string,
    ){
        return this.userService.updatePassword(req.user.id, newPassword, oldPassword);
    }

    @Get('byId')
    getUserById(
        @Query('userId') userId: string
    ){
        return this.userService.getUserById(userId);
    }

    @Get('all')
    getUsers(
        @Query() query: GetUsersFiltersDto,
    ){
        return this.userService.getUsers(query);
    }

    @Post('update')
    updateUser(
        @Request() req: any,
        @Body() body: Partial<User>
    ){
        return this.userService.updateUser(req.user.id, body);
    }

    @Delete()
    softDelete(
        @Param() userId: string
    ){
        return this.userService.softDelete(userId);
    }
}
