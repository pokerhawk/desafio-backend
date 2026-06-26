import { Module } from '@nestjs/common';
import { ClientModule } from 'src/client/client.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';


@Module({
  imports: [ClientModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}
