import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { ClientService } from 'src/client/client.service';
import { paginated, skipOption } from 'src/utils/pagination/pagination';
import * as bcrypt from 'bcrypt'
import { GetUsersFiltersDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: ClientService,
    ){}

    async updatePassword(userId: string, newPassword: string, oldPassword: string){
        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
                password: bcrypt.hashSync(oldPassword, 10),
            }
        })

        if(!user) return HttpStatus.BAD_REQUEST;

        const update = await this.prisma.user.update({
            where: {id: userId},
            data: {password: bcrypt.hashSync(newPassword, 10)}
        })

        if(!update) return HttpStatus.BAD_REQUEST;
        return HttpStatus.OK;
    }

    async getUserById(userId:string){
        return await this.prisma.user.findUnique({where: {id: userId}});
    }

    async getUsers(query: GetUsersFiltersDto){
        const whereOptions: Prisma.UserWhereInput = {};
        if(query.operator) whereOptions.operator = query.operator;
        if(query.email) whereOptions.email = query.email;

        const [users, usersCount] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where: whereOptions,
                orderBy: {
                    createdAt: 'desc'
                },
                take: query.rows,
                skip: skipOption(query.rows, query.page),
                select: {
                    id: true,
                    operator: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                }
            }),
            this.prisma.user.count({
                where: whereOptions
            }),               
        ]);

        return paginated(users, usersCount, query.page, query.rows);
    }

    async updateUser(loggedUserId: string, body: Partial<User>){
        const account = await this.prisma.user.findUnique({where:{id: loggedUserId}});
        const update = await this.prisma.user.update({
            where:{id: loggedUserId},
            data: {
                operator: body.operator? body.operator: account.operator,
                email: body.email? body.email: account.email,
            }
        })

        if(update){
            return {
                statusCode: HttpStatus.OK,
                message: "Atualizado com sucesso"
            }
        }
        throw new HttpException('Algo deu errado', HttpStatus.BAD_REQUEST);
    }

    async softDelete(userId: string){
        const user = await this.prisma.user.findFirst({where: {id: userId}});
        return await this.prisma.user.update({
            where: {id: user.id},
            data: {
                deletedAt: new Date()
            }
        });
    }
}
