import { Injectable, BadRequestException } from '@nestjs/common';

export interface CreateTripDto {
  passenger_id: number;
  origin_address: string;
  origin_lat: number;
  origin_lng: number;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  category: 'eco' | 'comfort' | 'speed' | 'freight';
  currency: 'USD' | 'BRL';
  initial_offer?: number; // Para o modo MOVY Negocia
}

export interface CounterOfferDto {
  trip_id: string;
  driver_id: number;
  increment: number; // Ex: 1.00, 2.00, 3.00, 5.00
  currency: 'USD' | 'BRL';
}

@Injectable()
export class TripsService {
  private activeTrips = new Map<string, any>();

  async requestTrip(dto: CreateTripDto) {
    const tripUuid = 'trip_' + Math.random().toString(36).substring(2, 9);
    const pinCode = Math.floor(1000 + Math.random() * 9000).toString(); // PIN de 4 dígitos para embarque

    const baseFare = dto.currency === 'USD' ? 12.50 : 22.00;
    const finalFare = dto.initial_offer || baseFare;

    const trip = {
      uuid: tripUuid,
      passenger_id: dto.passenger_id,
      driver_id: null,
      status: dto.initial_offer ? 'negotiating' : 'searching',
      origin: { address: dto.origin_address, lat: dto.origin_lat, lng: dto.origin_lng },
      destination: { address: dto.destination_address, lat: dto.destination_lat, lng: dto.destination_lng },
      category: dto.category,
      currency: dto.currency,
      fare_total: finalFare,
      pin_code: pinCode,
      offers: [],
      created_at: new Date(),
    };

    this.activeTrips.set(tripUuid, trip);
    return trip;
  }

  // Módulo MOVY NEGOCIA: Contraproposta Rápida do Motorista
  async submitCounterOffer(dto: CounterOfferDto) {
    const trip = this.activeTrips.get(dto.trip_id);
    if (!trip) throw new BadRequestException('Trip not found or expired.');

    const newOfferedPrice = Number((trip.fare_total + dto.increment).toFixed(2));
    const offer = {
      driver_id: dto.driver_id,
      driver_name: 'Carlos Driver',
      vehicle: 'Toyota Camry 2024 - Silver',
      rating: 4.96,
      offered_price: newOfferedPrice,
      currency: dto.currency,
      timestamp: new Date(),
    };

    trip.offers.push(offer);
    return {
      success: true,
      message: dto.currency === 'USD' 
        ? `Counter-offer of $${newOfferedPrice.toFixed(2)} sent to passenger!`
        : `Contraproposta de R$${newOfferedPrice.toFixed(2)} enviada ao passageiro!`,
      offer,
    };
  }

  async verifyPinAndStart(tripId: string, enteredPin: string) {
    const trip = this.activeTrips.get(tripId);
    if (!trip) throw new BadRequestException('Trip not found.');
    if (trip.pin_code !== enteredPin) {
      throw new BadRequestException('Invalid PIN code! Passenger verification failed.');
    }

    trip.status = 'trip_in_progress';
    return {
      success: true,
      message: 'PIN verified successfully! Trip has officially started.',
      trip,
    };
  }
}
