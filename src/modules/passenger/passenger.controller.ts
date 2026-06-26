import { Controller, UseGuards } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('passenger')
export class PassengerController {
    constructor(
        private readonly passengerService: PassengerService
    ){}
}
