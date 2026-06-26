import { Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class PassengerService {
    constructor(
        private readonly prisma: ClientService,
    ){}

    async outra(userId:string){
        return await this.prisma.user.findUnique({where: {id: userId}});
    }
}
