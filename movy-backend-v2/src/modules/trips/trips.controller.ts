import { Controller, Post, Body, Param } from '@nestjs/common';
import { TripsService, CreateTripDto, CounterOfferDto } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post('request')
  async requestTrip(@Body() dto: CreateTripDto) {
    return this.tripsService.requestTrip(dto);
  }

  // Rota do MOVY Negocia para o Motorista
  @Post('negocia/counter-offer')
  async counterOffer(@Body() dto: CounterOfferDto) {
    return this.tripsService.submitCounterOffer(dto);
  }

  @Post(':id/verify-pin')
  async verifyPin(@Param('id') id: string, @Body() body: { pin: string }) {
    return this.tripsService.verifyPinAndStart(id, body.pin);
  }
}
