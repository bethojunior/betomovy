import { Injectable } from '@nestjs/common';
import { DirectionApi } from './contracts/directionApi';

@Injectable()
export class GoogleDirection extends DirectionApi {
  async getFullAddress(): Promise<DirectionFullAddressResponse> {
    this.setUrl('https://maps.googleapis.com/maps/api/distancematrix/json');
    this.setParam(
      'origins',
      `${this.origin.latitude},${this.origin.longitude}`,
    );
    this.setParam(
      'destinations',
      `${this.destination.latitude},${this.destination.longitude}`,
    );

    const { data } = await this.getDistance<GoogleDirectionApiResponse>();

    if (!data) {
      this.logger.warn('No data found');
      return null;
    }

    if (data.error_message) {
      this.logger.warn('Error message', { data });
      return null;
    }

    if (data.status != 'OK') {
      this.logger.warn('Status not OK', { data });
      return null;
    }

    return {
      destination: data.destination_addresses[0],
      origin: data.origin_addresses[0],
      distance: data.rows[0].elements[0].distance,
      duration: data.rows[0].elements[0].duration,
    };
  }
}
