import { Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { numberToBRL, removeSpaces, toPercentString } from 'src/utils/functions';
import * as XLSX from 'xlsx';
import * as iconv from 'iconv-lite';

@Injectable()
export class AnalyticsService {
    constructor(
        private readonly prisma: ClientService,
    ){}


    async importExcel(file: Express.Multer.File) {
        const workbook = XLSX.read(file.buffer, {
            type:'buffer',
            codepage: 65001
        });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);

        const validRows: any[] = [];
        const errors: any[] = [];
        let totalPassengers = 0;
        let totalCapacity = 0;
        let totalExpectedRevenue = 0;

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

            totalPassengers += actual_passengers;
            totalCapacity += capacity;
            const average_occupancy = (actual_passengers*100)/capacity;
            const expectedRevenue = actual_passengers * ticket_price;
            totalExpectedRevenue += expectedRevenue;

            const key = `${row.route_name}::${row.operator_assigned}`;
            const delay = Number(row.delay_minutes) || 0;
            grouped.set(key, (grouped.get(key) || 0) + delay);

            validRows.push({
                trip_id,
                route_name,
                operator_assigned,
                capacity,
                average_occupancy: toPercentString(average_occupancy),
                expectedRevenue: numberToBRL(expectedRevenue.toFixed(2)),
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


        // const allData = workbook.SheetNames.flatMap((name) => {
        //     const sheet = workbook.Sheets[name];
        //     const rows = XLSX.utils.sheet_to_json(sheet);

        //     console.log(`Sheet: ${name}`);
        //     console.log(`Rows: ${rows.length}`);

        //     return rows.map((row: any) => ({
        //         trip_id: row.trip_id,
        //         route_name: row.route_name,
        //         operator_assigned: row.operator_assigned,
        //         capacity: row.capacity,
        //         actual_passengers: row.actual_passengers,
        //         ticket_price: row.ticket_price,
        //         delay_minutes: row.delay_minutes,
        //         sheet: name,
        //     }));
        // })

        // constros data = rows.map((row: any) => ({
        //     trip_id: row.trip_id,
        //     route_name: row.route_name,
        //     operator_assigned: row.operator_assigned,
        //     capacity: row.capacity,
        //     actual_passengers: row.actual_passengers,
        //     ticket_price: row.ticket_price,
        //     delay_minutes: row.delay_minutes,
        // }));

        // await this.prisma.user.createMany({
        //     data,
        //     skipDuplicates: true,
        // });

        // const createTripTest = await this.prisma.trip.create({
        //     data: {
        //         status: "on_route",
        //         destination: `${validRows[0].route_name.split("-")[1]}`,
        //         flight_number: "42",
        //         departure_date: new Date(),
        //         trip_id: validRows[0].trip_id,
        //         route: validRows[0].route_name,
        //         passengers: validRows[0].actual_passengers,
        //         ticket_price: validRows[0].ticket_price,
        //         delay_minutes: validRows[0].delay_minutes
        //     }
        // })

        // console.log(createTripTest)

        return {
            totalPassengers,
            total_average_occupancy: toPercentString((totalPassengers*100)/totalCapacity),
            totalExpectedRevenue: numberToBRL(totalExpectedRevenue.toFixed(2)),
            bottleneck,
            validRows,
            errors
        }
    }
}
