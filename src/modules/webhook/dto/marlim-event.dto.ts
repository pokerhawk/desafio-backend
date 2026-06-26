import { Type } from "class-transformer";
import { IsString, IsIn, IsISO8601, IsNumber, IsInt, IsOptional } from "class-validator";

export class MarlimEventPayloadDto {
  @IsString()
  @IsIn(["transaction_status_changed"])
  event: string;

  @IsString()
  transaction_id: string;

  @IsString()
  item_id: string;

  @IsString()
  payment_method: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  current_status?: MarlimTransactionStatus;

  @IsString()
  nsu: string;

  @IsString()
  authorization_code: string;

  @IsISO8601()
  date_created: string;

  @IsISO8601()
  date_updated: string;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  @Type(() => Number)
  @IsNumber()
  paid_amount: number;

  @Type(() => Number)
  @IsInt()
  installments: number;

  @IsString()
  card_holder_name: string;

  @IsString()
  card_brand: string;

  @IsString()
  card_first_digits: string;

  @IsString()
  card_last_digits: string;

  @IsString()
  acquirer_status_code: string;
}

export type MarlimTransactionStatus = 'refunded' | 'chargeback' | 'refused' | 'failed' | 'rejected' | 'paid' | 'review';
