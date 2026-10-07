import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TripEventDto } from './dto/trip-events.dto';
import { TripEventsProcessorService } from './trip-events-processor.service';

@Controller('webhook/trip')
export class TripEventsController {
  constructor(private readonly processor: TripEventsProcessorService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleWebhook(@Body() body: TripEventDto) {
    await this.processor.process(body);
    return { message: `Event emitted: ${body.event}` };
  }
}
