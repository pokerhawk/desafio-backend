import { IsNumber, IsObject, IsOptional, IsString } from "class-validator";

class AddressProps {
    @IsString()
    country: string;
    
    @IsString()
    state: string;
    
    @IsString()
    city: string;
    
    @IsString()
    district: string;
    
    @IsString()
    street: string;
    
    @IsString()
    number: string;
    
    @IsString()
    zipCode: string;
    
    @IsString()
    complement: string;
}

type DomainProps = 'ORDER' | 'SUBSCRIPTION' | 'PHYSICAL_ORDER';
type BarteStatusProps = 'PAID' | 'SENT' | 'CANCELED';

export class BarteEventPayloadDto {
    @IsString()
    uuid: string;
    
    @IsString()
    dateTime: string;
    
    @IsString()
    status: BarteStatusProps;
    
    @IsString()
    domain: DomainProps;
    
    @IsString()
    uuidBuyer: string;
    
    @IsString()
    documentBuyer: string;
    
    @IsObject()
    address: AddressProps;
    
    @IsString()
    emailBuyer: string;
    
    @IsString()
    metadata: string;
    
    @IsString()
    cnpjSeller: string;
    
    @IsNumber()
    idSeller: number;

    //Not sure of this:

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsNumber()
    installments?: number;

    @IsOptional()
    @IsNumber()
    first4_digits?: number;

    @IsOptional()
    @IsNumber()
    last4_digitos?: number;

    @IsOptional()
    @IsString()
    holderName?: string;

    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @IsString()
    authorization_code?: string;

    @IsOptional()
    @IsString()
    authorization_nsu?: string;

    @IsOptional()
    @IsString()
    pos_id?: string;

    @IsOptional()
    @IsString()
    cnpj?: string;

    @IsOptional()
    @IsString()
    company_name?: string;
}
