import { HttpService } from '@nestjs/axios';
import { Inject, Logger } from '@nestjs/common';

export abstract class DirectionApi {
  protected origin: LocationRequest;
  protected destination: LocationRequest;
  protected waypoints: LocationRequest[] = [];
  protected url: string = null;
  protected params: { [attribute: string]: string } = {};
  protected headers: { [attribute: string]: string } = {};

  protected logger: Logger = new Logger(this.constructor.name);

  constructor(
    @Inject(HttpService) protected readonly httpService: HttpService,
  ) {}

  abstract getFullAddress(): Promise<DirectionFullAddressResponse>;

  setOrigin(origin: LocationRequest): DirectionApi {
    this.origin = origin;
    return this;
  }

  setDestination(destination: LocationRequest): DirectionApi {
    this.destination = destination;
    return this;
  }

  setWaypoints(waypoints: LocationRequest[]): DirectionApi {
    this.waypoints = waypoints;
    return this;
  }

  setUrl(url: string): DirectionApi {
    this.url = url;
    return this;
  }

  getUrl(): string {
    return this.url;
  }

  setParam(attribute: string, value: string) {
    this.params[attribute] = value;
  }

  setHeader(attribute: string, value: string) {
    this.headers[attribute] = value;
  }

  protected async getDistance<T>() {
    this.logger.log(`Requesting ${this.url}`, { params: this.params });
    return this.httpService.axiosRef.get<T>(this.url, {
      params: this.params,
      headers: this.headers,
      timeout: 9000,
    });
  }
}
