import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  constructor(
    private readonly prisma: ClientService,
  ) {}

  async funcao(payload: any){
    return true
  }
}
