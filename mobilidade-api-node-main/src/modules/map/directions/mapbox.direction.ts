import { Injectable } from '@nestjs/common';
import { DirectionApi } from './contracts/directionApi';

@Injectable()
export class MapBoxDirection extends DirectionApi {
  async getFullAddress(): Promise<DirectionFullAddressResponse> {
    let url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${this.origin.longitude},${this.origin.latitude};`;

    if (this.waypoints.length > 0) {
      url +=
        this.waypoints
          .map((item) => `${item.longitude},${item.latitude}`)
          .join(';') + ';';
    }
    url += `${this.destination.longitude},${this.destination.latitude}`;
    this.setParam('alternatives', 'false');
    this.setParam('geometries', 'polyline');
    this.setParam('steps', 'true');
    this.setUrl(url);

    const { data } = await this.getDistance<MapBoxDirectionApiResponse>();

    if (!data) {
      this.logger.warn('No data found');
      return null;
    }

    if (!data.routes) {
      this.logger.warn('No routes found', { data });
      return null;
    }

    return {
      origin: data.waypoints[0].name,
      destination: data.waypoints[1].name,
      distance: {
        text: `${(data.routes[0].distance / 1000).toFixed(1)} km`,
        value: data.routes[0].distance,
      },
      duration: {
        text: `${(data.routes[0].duration / 60).toFixed(1)} mins`,
        value: data.routes[0].duration,
      },
    };
  }
}
