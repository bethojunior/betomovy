import { Injectable } from '@nestjs/common';
import { DirectionApi } from './contracts/directionApi';

@Injectable()
export class HereDirection extends DirectionApi {
  async getFullAddress(): Promise<DirectionFullAddressResponse> {
    this.setUrl('https://router.hereapi.com/v8/routes');
    this.setParam('origin', `${this.origin.latitude},${this.origin.longitude}`);
    this.setParam(
      'destination',
      `${this.destination.latitude},${this.destination.longitude}`,
    );
    this.setParam('transportMode', 'car');
    this.setParam('lang', 'pt-BR');
    this.setParam('return', 'polyline,summary');
    this.setParam('spans', 'names');

    const { data } = await this.getDistance<HereDirectionApiResponse>();

    if (!data) {
      this.logger.warn('No data found');
      return null;
    }

    if (!data.routes) {
      this.logger.warn('No routes found', { data });
      return null;
    }

    const route = data.routes[0].sections[0];

    const origin = route.spans.find((span) => span.names?.length > 0);

    if (!origin) {
      this.logger.warn('No origin found', { route });
      return null;
    }

    const destination = route.spans
      .reverse()
      .find((span) => span.names?.length > 0);

    return {
      origin: origin.names[0].value,
      destination: destination.names[0].value,
      distance: {
        text: `${(route.summary.length / 1000).toFixed(1)} km`,
        value: route.summary.length,
      },
      duration: {
        text: `${(route.summary.duration / 60).toFixed(1)} mins`,
        value: route.summary.duration,
      },
    };
  }
}
