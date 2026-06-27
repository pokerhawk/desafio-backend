import { Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { generateRandomFlightCode, numberToBRL, randomFutureDate, toPercentString } from 'src/utils/functions';
import * as XLSX from 'xlsx';
import * as iconv from 'iconv-lite';
import { Prisma, Trip } from '@prisma/client';

interface TripProps {
    trip_id: string;
    route_name: string;
    operator_assigned: string;
    capacity: number;
    average_occupancy: string;
    actual_passengers: number;
    ticket_price: number;
    delay_minutes: number;
}

@Injectable()
export class AnalyticsService {
    constructor(
        private readonly prisma: ClientService,
    ){}

    async importExcel(file: Express.Multer.File) {
        const isThereAnyTrips = await this.prisma.trip.findFirst();
        const firstOperator = await this.prisma.user.findFirst();
        const workbook = XLSX.read(file.buffer, {
            type:'buffer',
            codepage: 65001
        });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);

        const validRows: any[] = [];
        const errors: any[] = [];
        let total_passengers = 0;
        let total_capacity = 0;
        let total_expected_revenue = 0;

        const grouped = new Map<string, number>();
        let maxKey = '';
        let maxValue = 0;

        rows.forEach((row: any, index: number) => {
            const trip_id = row.trip_id;
            const route_name = row.route_name;
            const operator_assigned = row.operator_assigned;

            const capacity = Number(row.capacity);
            const actual_passengers = Number(row.actual_passengers);
            const ticket_price = Number(row.ticket_price);
            const delay_minutes = Number(row.delay_minutes);

            if (
                !trip_id ||
                !route_name ||
                !operator_assigned ||
                isNaN(capacity) ||
                isNaN(actual_passengers)
            ) {
                errors.push({
                    row: index + 1,
                    reason: 'Missing or invalid fields',
                    data: row,
                });

                return;
            }

            total_passengers += actual_passengers;
            total_capacity += capacity;
            const average_occupancy = (actual_passengers*100)/capacity;
            const expected_revenue = actual_passengers * ticket_price;
            total_expected_revenue += expected_revenue;

            const key = `${row.route_name}::${row.operator_assigned}`;
            const delay = Number(row.delay_minutes) || 0;
            grouped.set(key, (grouped.get(key) || 0) + delay);

            validRows.push({
                trip_id,
                route_name,
                operator_assigned,
                capacity,
                average_occupancy: toPercentString(average_occupancy),
                expected_revenue: numberToBRL(expected_revenue.toFixed(2)),
                actual_passengers,
                ticket_price,
                delay_minutes,
            });
        });

        for (const [key, totalDelay] of grouped.entries()) {
            if (totalDelay > maxValue) {
                maxValue = totalDelay;
                maxKey = key;
            }
        }
 
        const [route_name, operator_assigned] = maxKey.split('::');
        let bottleneck = {
          route_name,
          operator_assigned,
          total_delay: maxValue,
        };

        if(!isThereAnyTrips){
            const formatted:Prisma.TripCreateManyInput[] = validRows.map((trip: TripProps) => ({
                id: trip.trip_id,
                status: 'awaiting',
                destination: trip.route_name.split("-")[1].replace(" ", ""),
                flight_number: generateRandomFlightCode(),
                departure_date: randomFutureDate(),
                route: trip.route_name,
                passengers: trip.actual_passengers,
                ticket_price: trip.ticket_price,
                delay_minutes: trip.delay_minutes,
            }))
            const operatorUserFormatted: Prisma.UserTripCreateManyInput[] = formatted.map((data: Trip) => ({
                tripId: data.id,
                userId: firstOperator.id
            }));
            await this.prisma.trip.createMany({
                data: formatted,
                skipDuplicates: true
            })
            await this.prisma.userTrip.createMany({
                data: operatorUserFormatted,
                skipDuplicates: true
            })
        }

        return {
            total_passengers,
            total_average_occupancy: toPercentString((total_passengers*100)/total_capacity),
            total_expected_revenue: numberToBRL(total_expected_revenue.toFixed(2)),
            bottleneck,
            // validRows,
            // errors
        }
    }
}
