import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetUsersFiltersDto {
  @Type(() => Number)
  @IsNumber()
  rows: number;

  @Type(() => Number)
  @IsNumber()
  page: number;

  @IsOptional()
  @IsString()
  operator?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  businessId?: string;
}
