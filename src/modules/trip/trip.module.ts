import { Module } from '@nestjs/common';
import { ClientModule } from 'src/client/client.module';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';

@Module({
  imports: [ClientModule],
  controllers: [TripController],
  providers: [TripService],
  exports: [TripService]
})
export class TripModule {}
