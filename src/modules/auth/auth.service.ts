import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import * as bcrypt from 'bcrypt'
import { CreateAccountDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { userToReturnMapper } from 'src/utils/mappers/user-to-return.mapper';

export type loginProps = {
    email: string;
    password: string;
    code: string;
}

type userJwtProps = {
    sub: string;
    email: string;
    operator?: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: ClientService,
        private readonly jwtService: JwtService,
    ){}

    validateApiKey(apiKey: string){
        // const apiKeys: Array<string> = [process.env.API_KEY];
        const apiKeys: string[] = process.env.API_KEY?.split(',') ?? [];
        return apiKeys.find(key => key == apiKey)
    }

    async validateUser(email: string, password: string){
        const account = await this.prisma.user.findUnique({where: {email: email}})
        if (account && await bcrypt.compare(password, account.password)) {
            return userToReturnMapper(account);
        }
        return;
    }

    async register(userPayload: CreateAccountDto){
        const account = {
            ...userPayload,
            password: bcrypt.hashSync(userPayload.password, 10)
        };

        const create = await this.prisma.user.create({
            data: {
                operator: account.operator,
                email: account.email,
                password: account.password,
            }
        })

        if(!create)
            return HttpStatus.BAD_REQUEST
        return HttpStatus.OK
    }

    async login(userPayload: loginProps){
        const account = await this.prisma.user.findUnique({where:{email: userPayload.email}})
        if(!account)throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        const validateUser = await this.validateUser(account.email, userPayload.password);
        if(!validateUser)throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);


        const accountJwt: userJwtProps = {
            sub: validateUser.id,
            email: validateUser.email,
            operator: validateUser.operator,
        };
        
        return {
            message: `Bem vindo ${account.operator}`,
            accountId: account.id,
            access_token: this.jwtService.sign(accountJwt),
            refresh_token: this.jwtService.sign(accountJwt, { expiresIn: '16h' }),
        }
    }
}
