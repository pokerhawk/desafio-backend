import { Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { CreatePassangerDto, GetPassengersDto } from './dto/trip.dto';
import { paginated, skipOption } from 'src/utils/pagination/pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class TripService {
    constructor(
        private readonly prisma: ClientService,
    ){}

    async createPassenger(body: CreatePassangerDto){
        const tripExists = await this.prisma.trip.findUnique({
            where: { trip_id: body.trip_id }
        });
        
        await this.prisma.passenger.create({
            data: {
                name: body.name,
                document: body.document,
                seat_number: body.seat_number,
                documentType: body.documentType,
                flight_class: body.flight_class,
                tripId: tripExists.id
            }
        })
    }

    async getPassengers(query: GetPassengersDto){
        const whereOptions: Prisma.PassengerWhereInput = {};

        if(query.name) whereOptions.name = query.name;
        if(query.document) whereOptions.document = query.document;
        if(query.flight_class) whereOptions.flight_class = query.flight_class;
        if(query.tripId) whereOptions.tripId = query.tripId;

        const [users, usersCount] = await this.prisma.$transaction([
            this.prisma.passenger.findMany({
                where: whereOptions,
                orderBy: {
                    createdAt: 'desc'
                },
                take: query.rows,
                skip: skipOption(query.rows, query.page),
            }),
            this.prisma.passenger.count({
                where: whereOptions
            }),               
        ]);

        return paginated(users, usersCount, query.page, query.rows);
    }
}
