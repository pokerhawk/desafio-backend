import { Body, Controller, Post } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { BarteEventPayloadDto } from "./dto/barte-event.dto";
import { IsPublic } from "src/shared/decorators/is-public.decorator";

@IsPublic()
@Controller('webhook')
export class WebhookController {
    constructor(
        private readonly webhookService: WebhookService
    ){}

    @Post('barte')
    barteEvent(
        @Body() payload: BarteEventPayloadDto,
    ){
        return this.webhookService.funcao(payload);
    }
}
