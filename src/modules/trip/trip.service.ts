import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { CreatePassangerDto, GetPassengersDto, GetTripsDto } from './dto/trip.dto';
import { paginated, skipOption } from 'src/utils/pagination/pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class TripService {
    constructor(
        private readonly prisma: ClientService,
    ){}

    async createPassenger(body: CreatePassangerDto){
        const tripExists = await this.prisma.trip.findUnique({
            where: { id: body.trip_id }
        });
        if(!tripExists)throw new BadRequestException("Trip doesn't exists");
        
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

        return {
            statusCode: HttpStatus.CREATED,
            message: "Passageiro Criado"
        }
    }

    async getPassengers(query: GetPassengersDto){
        const whereOptions: Prisma.PassengerWhereInput = {};

        if(query.name) whereOptions.name = query.name;
        if(query.document) whereOptions.document = query.document;
        if(query.documentType) whereOptions.documentType = query.documentType;
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

    async getTrips(query: GetTripsDto){
        const whereOptions: Prisma.TripWhereInput = {};

        if(query.trip_id) whereOptions.id = query.trip_id;
        if(query.status) whereOptions.status = query.status;
        if(query.departure_date) whereOptions.departure_date = new Date(query.departure_date);

        console.log(whereOptions)
        const [users, usersCount] = await this.prisma.$transaction([
            this.prisma.trip.findMany({
                where: whereOptions,
                orderBy: {
                    createdAt: 'desc'
                },
                take: query.rows,
                skip: skipOption(query.rows, query.page),
            }),
            this.prisma.trip.count({
                where: whereOptions
            }),               
        ]);

        return paginated(users, usersCount, query.page, query.rows);
    }
}
