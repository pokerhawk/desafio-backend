import { DocumentTypeEnum, FlightClassEnum } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTripDto {
  @IsString()
  id: string;

  @IsString()
  status: string;

  @IsString()
  destination: string;

  @IsString()
  flight_number: string;

  @IsDate()
  departure_date: Date;

  @IsString()
  route: string;

  @IsNumber()
  passengers: number;

  @IsNumber()
  ticket_price: number;

  @IsNumber()
  delay_minutes: number;
}

export class CreatePassangerDto {
  @IsString()
  trip_id: string;

  @IsString()
  name: string;

  @IsString()
  document: string;

  @IsEnum(DocumentTypeEnum)
  documentType: DocumentTypeEnum;

  @IsString()
  seat_number: string;

  @IsEnum(FlightClassEnum)
  flight_class: FlightClassEnum;
}

export class GetPassengersDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsEnum(DocumentTypeEnum)
  documentType?: DocumentTypeEnum;

  @IsOptional()
  @IsEnum(FlightClassEnum)
  flight_class?: FlightClassEnum;

  @IsOptional()
  @IsString()
  tripId?: string;

  @Type(() => Number)
  @IsNumber()
  rows: number;

  @Type(() => Number)
  @IsNumber()
  page: number;
}

export class GetTripsDto {
  @IsOptional()
  @IsString()
  trip_id?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  departure_date?: string;

  @Type(() => Number)
  @IsNumber()
  rows: number;

  @Type(() => Number)
  @IsNumber()
  page: number;
}
