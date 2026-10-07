import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigRepository } from 'src/modules/config/config.repository';
import {
  GoogleDirection,
  HereDirection,
  MapBoxDirection,
  SeuMiltoMapsDirection,
} from '../directions';
import { DirectionApi } from '../directions/contracts/directionApi';

@Injectable()
export class DirectionService {
  private servicesList: Array<string> = [];
  private defaultAPI: string;
  private enableCustomModeOfMapService: string = null;

  private logger: Logger = new Logger('DirectionService');

  constructor(
    @Inject(ConfigRepository)
    private readonly configRepository: ConfigRepository,
    @Inject(GoogleDirection)
    private readonly googleDirection: GoogleDirection,
    @Inject(HereDirection)
    private readonly hereDirection: HereDirection,
    @Inject(MapBoxDirection)
    private readonly mapBoxDirection: MapBoxDirection,
    @Inject(SeuMiltoMapsDirection)
    private readonly seuMiltoMapsDirection: SeuMiltoMapsDirection,
  ) {}

  async loadConfig() {
    this.logger.log('Loading config of map services');
    const value = await this.configRepository.get('service_priority_direction');
    this.servicesList = JSON.parse(value);
    this.enableCustomModeOfMapService = await this.configRepository.get(
      'enable_custom_mode_of_map_services',
    );

    this.logger.log('Config loaded', {
      servicesList: this.servicesList,
      enableCustomModeOfMapService: this.enableCustomModeOfMapService,
    });

    await this.getFirstService();
  }

  async getDistanceWithFullAddressGeneralConfig(
    start_latitude: string,
    start_longitude: string,
    end_latitude: string,
    end_longitude: string,
    isFirst = true,
  ): Promise<DirectionFullAddressResponse> {
    if (!isFirst) {
      this.defaultAPI = this.getNextService();
    }

    const defaultApi = await this.choiceDefaultApi();
    this.removeService(this.defaultAPI);

    defaultApi.setOrigin({
      latitude: start_latitude,
      longitude: start_longitude,
    });
    defaultApi.setDestination({
      latitude: end_latitude,
      longitude: end_longitude,
    });
    const result = await defaultApi.getFullAddress().catch((err) => {
      this.logger.error('Erro no mapa: ' + this.defaultAPI, err.message || err);
      return null;
    });

    if (!result) {
      if (this.servicesList.length === 0)
        throw new Error('Não foi possivel obter serviço de mapa');

      return await this.getDistanceWithFullAddressGeneralConfig(
        start_latitude,
        start_longitude,
        end_latitude,
        end_longitude,
        false,
      );
    }

    this.logger.log('Result of map', {
      result,
      defaultAPI: this.defaultAPI,
    });

    return result;
  }

  private async getFirstService(): Promise<void> {
    if (this.enableCustomModeOfMapService) {
      this.defaultAPI = this.getNextService();
      this.logger.log('Custom mode of map service', {
        defaultAPI: this.defaultAPI,
      });
    } else {
      this.logger.log('Loading default API');
      this.defaultAPI = await this.configRepository.get('default_maps_api');
      this.logger.log('Default API loaded', { defaultAPI: this.defaultAPI });
    }
  }

  private getNextService(): string {
    return this.servicesList[0];
  }

  private removeService(service: string): void {
    this.logger.log('Removing service', { service });
    this.servicesList = this.servicesList.filter((item) => {
      return item != service;
    });
  }

  private async choiceDefaultApi(): Promise<DirectionApi> {
    switch (this.defaultAPI) {
      case 'google':
        this.googleDirection.setParam(
          'key',
          await this.configRepository.get('google_api_key_backend'),
        );
        return this.googleDirection;
      case 'mapbox':
        this.mapBoxDirection.setParam(
          'access_token',
          await this.configRepository.get('mapbox_access_token'),
        );
        return this.mapBoxDirection;
      case 'here':
        this.hereDirection.setParam(
          'apikey',
          await this.configRepository.get('here_api_key'),
        );
        return this.hereDirection;
      case 'seumilto':
        this.seuMiltoMapsDirection.setHeader(
          'tokenname',
          await this.configRepository.get('seumilto_token_name'),
        );
        this.seuMiltoMapsDirection.setHeader(
          'token',
          await this.configRepository.get('seumilto_token'),
        );
        this.seuMiltoMapsDirection.setHeader('Accept', 'application/json');

        return this.seuMiltoMapsDirection;
      default:
        throw Error('Erro ao encontrar API Padrão');
    }
  }
}
