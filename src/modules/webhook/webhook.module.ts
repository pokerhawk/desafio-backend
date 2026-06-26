import { Module } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";
import { ClientModule } from "src/client/client.module";

@Module({
  imports: [ClientModule],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService]
})

export class WebhookModule {}
