import { Injectable } from '@nestjs/common';
import { DirectionApi } from './contracts/directionApi';

@Injectable()
export class SeuMiltoMapsDirection extends DirectionApi {
  async getFullAddress(): Promise<DirectionFullAddressResponse> {
    let url = `https://api.maps.seumiltho.com.br/directions/full-address?origin=${this.origin.latitude},${this.origin.longitude}`;
    url += `&destination=${this.destination.latitude},${this.destination.longitude}`;

    if (this.waypoints.length > 0) {
      url +=
        '&waypoints=' +
        this.waypoints
          .map((item) => `${item.latitude},${item.longitude}`)
          .join('|');
    }
    this.setUrl(url);

    const { data } = await this.getDistance<SeuMiltoMapsDirectionApiResponse>();

    if (!data) {
      this.logger.warn('No data found');
      return null;
    }

    if (!data.response) {
      this.logger.warn('No routes found', { data });
      return null;
    }

    return {
      origin: data.response.origin,
      destination: data.response.destination,
      distance: {
        text: data.response.distance.text,
        value: data.response.distance.value,
      },
      duration: {
        text: data.response.duration.text,
        value: data.response.duration.value,
      },
    };
  }
}
