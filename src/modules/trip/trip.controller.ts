import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TripService } from './trip.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreatePassangerDto, GetPassengersDto, GetTripsDto } from './dto/trip.dto';

@UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripController {
    constructor(
        private readonly tripService: TripService
    ){}

    @Post()
    createPassenger(
        @Body() body: CreatePassangerDto
    ){
        return this.tripService.createPassenger(body);
    }

    @Get('passengers')
    getPassengers(
        @Query() query: GetPassengersDto,
    ){
        return this.tripService.getPassengers(query);
    }

    @Get()
    getTrips(
        @Query() query: GetTripsDto,
    ){
        return this.tripService.getTrips(query);
    }
}
