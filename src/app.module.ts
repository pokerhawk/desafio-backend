import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TripModule } from './modules/trip/trip.module';
import { UserModule } from './modules/user/user.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { PassengerModule } from './modules/passenger/passenger.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
    ConfigModule.forRoot(),
    AuthModule,
    TripModule,
    PassengerModule,
    UserModule,
    WebhookModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
