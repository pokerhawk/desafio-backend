import { Module } from '@nestjs/common';
import { ClientModule } from 'src/client/client.module';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';

@Module({
  imports: [ClientModule],
  controllers: [PassengerController],
  providers: [PassengerService],
  exports: [PassengerService]
})
export class PassengerModule {}
