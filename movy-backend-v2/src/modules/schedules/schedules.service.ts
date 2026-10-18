import { Injectable, BadRequestException } from '@nestjs/common';

export interface CreateScheduleDto {
  passenger_id: number;
  scheduled_for: string; // ISO Date string
  origin_address: string;
  origin_lat: number;
  origin_lng: number;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  category: 'eco' | 'comfort' | 'speed' | 'freight';
  currency: 'USD' | 'BRL';
}

@Injectable()
export class SchedulesService {
  private scheduledTrips = new Map<string, any>([
    {
      uuid: 'SCHED-MIA-001',
      passenger_id: 1,
      passenger_name: 'David Miller',
      scheduled_for: new Date(Date.now() + 86400000).toISOString(),
      origin_address: 'Fontainebleau Miami Beach, 4441 Collins Ave',
      origin_lat: 25.8175,
      origin_lng: -80.1223,
      destination_address: 'Miami International Airport (MIA) Concourse D',
      destination_lat: 25.7959,
      destination_lng: -80.2870,
      category: 'comfort',
      fare_estimate: 48.00,
      currency: 'USD',
      status: 'scheduled',
      driver_id: null,
    },
  ]);

  async createSchedule(dto: CreateScheduleDto) {
    const uuid = 'SCHED-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const fareEstimate = dto.currency === 'USD' ? 35.00 : 65.00;

    const scheduled = {
      uuid,
      passenger_id: dto.passenger_id,
      scheduled_for: dto.scheduled_for,
      origin_address: dto.origin_address,
      origin_lat: dto.origin_lat,
      origin_lng: dto.origin_lng,
      destination_address: dto.destination_address,
      destination_lat: dto.destination_lat,
      destination_lng: dto.destination_lng,
      category: dto.category,
      fare_estimate: fareEstimate,
      currency: dto.currency,
      status: 'scheduled',
      driver_id: null,
      created_at: new Date(),
    };

    this.scheduledTrips.set(uuid, scheduled);
    return {
      success: true,
      message: dto.currency === 'USD'
        ? 'Ride successfully scheduled in advance!'
        : 'Viagem agendada com sucesso!',
      scheduled,
    };
  }

  async listAvailable(currency: 'USD' | 'BRL' = 'USD') {
    return Array.from(this.scheduledTrips.values()).filter(
      (s) => s.currency === currency && s.status === 'scheduled'
    );
  }

  async acceptByDriver(uuid: string, driverId: number) {
    const trip = this.scheduledTrips.get(uuid);
    if (!trip) throw new BadRequestException('Scheduled trip not found.');
    if (trip.status !== 'scheduled') {
      throw new BadRequestException('This scheduled trip was already claimed.');
    }

    trip.driver_id = driverId;
    trip.status = 'accepted_by_driver';

    return {
      success: true,
      message: 'Scheduled trip successfully assigned to driver!',
      trip,
    };
  }
}
