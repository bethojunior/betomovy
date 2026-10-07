import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import {
  DRIVER_REGISTER_STATUS_ACTIVE,
  DRIVER_STATUS_IN_TRIP,
  DRIVER_STATUS_OFF,
} from './constants';
import { DriverRepository } from './repositories/driver.repository';
import { DriverLocationSyncPolicyService } from './services/driverLocationSyncPolicy.service';
import { SearchTripDto } from './dto';
import { Driver } from './entities/driver.entity';
import { DriverCalledRepository } from './repositories/driverCalled.repository';
import { SearchTripQuery } from 'src/@types/modules/driver/driverResponse';
import {
  RiskAreaRepository,
  TollTripRepository,
  TripHistoryRepository,
  TripRepository,
  TripWayPointRepository,
} from '../trip/repositories';
import { DirectionService } from '../map/services';
import { ConfigRepository } from '../config/config.repository';
import { LongDistanceRewardService } from '../reward/services';
import { RewardCampaignTripRepository } from '../reward/repositories';
import { TripLongDistanceValue } from '../reward/entities';
import { Balance } from '../trip/entities/balance.entity';
import { TollTrip, TripWayPoint } from '../trip/entities';
import { Server, Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { realTimeDriverConnectionUseCase } from './useCases/realTimeDriverConnectionUseCase';
import { StateCacheService } from '../state/state.service';
import { driverPositionUseCase } from './useCases/driverPositionUseCase';
import { RequestLocationDriverDto } from './dto/requestLocationDriver.dto';
import { DriverLocationDTO } from './dto/driverLocation.dto';
import { DRIVER_LOCATION } from './constants/cacheKeyConstants';
import { RealTimeDriverDisconnectioUseCase } from './useCases/realTimeDriverDisconnectioUseCase';

@Injectable()
export class DriverService {
  private logger: Logger = new Logger('DriverService');

  constructor(
    @Inject(DriverRepository)
    private readonly driverRepository: DriverRepository,
    @Inject(DriverCalledRepository)
    private readonly driverCalledRepository: DriverCalledRepository,
    @Inject(TripWayPointRepository)
    private readonly tripWayPointRepository: TripWayPointRepository,
    @Inject(TripRepository)
    private readonly tripRepository: TripRepository,
    @Inject(TollTripRepository)
    private readonly tollTripRepository: TollTripRepository,
    @Inject(RiskAreaRepository)
    private readonly riskAreaRepository: RiskAreaRepository,
    @Inject(ConfigRepository)
    private readonly configRepository: ConfigRepository,
    @Inject(RewardCampaignTripRepository)
    private readonly rewardCampaignTripRepository: RewardCampaignTripRepository,
    @Inject(DirectionService)
    private readonly directionService: DirectionService,
    @Inject(LongDistanceRewardService)
    private readonly longDistanceRewardService: LongDistanceRewardService,
    @Inject(TripHistoryRepository)
    private readonly tripHistoryRepository: TripHistoryRepository,
    @Inject(realTimeDriverConnectionUseCase)
    private readonly realTimeDriverConnectionUseCase: realTimeDriverConnectionUseCase,
    @Inject(RealTimeDriverDisconnectioUseCase)
    private readonly realTimeDriverDisconnectioUseCase: RealTimeDriverDisconnectioUseCase,
    @Inject(driverPositionUseCase)
    private readonly driverPositionUseCase: driverPositionUseCase,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(StateCacheService)
    private readonly stateCacheService: StateCacheService,
    @Inject(DriverLocationSyncPolicyService)
    private readonly driverLocationSyncPolicyService: DriverLocationSyncPolicyService,
  ) {}

  async searchTrip(payload: SearchTripDto) {
    const driver = await this.driverRepository.find(payload.driverId);

    console.log(
      'buscando viagem motorista: ',
      payload.driverId,
      ' - ',
      new Date().toISOString(),
    );

    this.verifyDriverForAcceptTrip(driver);

    if (payload.location) {
      await this.updateDriverPosition(payload.driverId, {
        lng: payload.location.longitude,
        lat: payload.location.latitude,
      });
    }

    const trip = await this.driverCalledRepository.findTripCallingDriverV2(
      driver.idDriver,
      payload.listTripsDenied,
    );

    trip.turbochargedPrice = !!trip?.turbochargedPrice;

    if (trip) {
      console.log(
        'viagem encontrada: ',
        trip.tripReference,
        ' - motorista: ',
        payload.driverId,
        ' - ',
        new Date().toISOString(),
      );
      trip.missingSeconds = '1'; //@TODO - buscar do driverCalled
      return this.mountTripObjects(trip, driver);
    }

    return trip;
  }

  async getTrip(payload: SearchTripDto) {
    const driver = await this.driverRepository.find(payload.driverId);

    this.verifyDriverForAcceptTrip(driver);

    if (payload.location) {
      await this.updateDriverPosition(payload.driverId, {
        lng: payload.location.longitude,
        lat: payload.location.latitude,
      });
    }

    const trip = await this.tripRepository.findByTripReference(
      payload.tripReference,
      payload.listTripsDenied,
      driver.idDriver,
    );

    if (trip) {
      console.log(
        'viagem encontrada: ',
        trip.tripReference,
        ' - motorista: ',
        payload.driverId,
        ' - ',
        new Date().toISOString(),
      );
      trip.missingSeconds = '1';
      return this.mountTripObjects(trip, driver);
    }

    console.log(
      'sem viagem encontrada para o motorista: ',
      payload.driverId,
      ' - ',
      new Date().toISOString(),
    );
    return trip;
  }

  private verifyDriverForAcceptTrip(driver: Driver) {
    if (driver.status === DRIVER_STATUS_OFF)
      throw new Error(
        `Status do motorista não permite nova corrida ID: ${driver.idDriver}`,
      );
    if (driver.driverRegisterStatusId !== DRIVER_REGISTER_STATUS_ACTIVE)
      throw new Error(
        `Cadastro do motorista não permite nova corrida ID: ${driver.idDriver}`,
      );
    if (driver.status === DRIVER_STATUS_IN_TRIP && !driver.preAvailable)
      throw new Error(`Status do motorista está em corrida ID: ${driver.idDriver}`);
  }

  private async mountTripObjects(
    trip: SearchTripQuery,
    driver: Driver,
  ): Promise<{
    typeCalled?: string;
    date: Date;
    distance: number;
    rewardTripId: number;
    driverValue: number;
    rewardValue: number;
    missingSeconds?: string;
    endDate: Date;
    rewardType: string;
    tripTypePicture: string;
    riskArea: { origin: boolean; destination: boolean };
    cityId: number;
    type: string;
    tolls: TollTrip[];
    allowsFavorite?: number;
    tripReference: string;
    timeToExpireTrip: number;
    startLatitude: string;
    ratingCustomer: number;
    price: number;
    greaterRadius?: number;
    paymentFormTypeId: number;
    radius?: number;
    customerImage: string | null;
    estimative: DirectionFullAddressResponse;
    callClose?: number;
    timeToIncrease?: number;
    callingDriver: string;
    startAddress: string;
    estimatedTripTime: number;
    quantityTripsCustomer: number;
    endLatitude: string;
    userId: number;
    tripWayPoints: TripWayPoint[];
    tripTypeId: number;
    timeLimitToAccept: string;
    nameCustomer: string;
    tripLongDistance: { value: number };
    idTrip: number;
    driverBalanceInStartCall: Balance;
    endLongitude: string;
    rewardTrip: { value: number };
    startLongitude: string;
    priceId: number;
    multiplierDynamic: number;
    tripPaymentForm: string;
    endAddress: string;
    status: string;
  }> {
    const timeLimitToAccept = await this.configRepository.get(
      'time_in_seconds_to_call_driver',
    );

    const tripWayPoints = await this.tripWayPointRepository.findByTrip(
      trip.tripReference,
    );

    const driverValue = await this.tripRepository.findDriverNetPrice(trip.tripReference);

    const tolls = await this.tollTripRepository.findByTrip(trip.idTrip);

    const riskArea = {
      origin: await this.riskAreaRepository.checkRiskArea(
        trip.startLatitude,
        trip.startLongitude,
      ),
      destination: await this.riskAreaRepository.checkRiskArea(
        trip.endLatitude,
        trip.endLongitude,
      ),
    };

    await this.insertTripsHistory(trip.tripReference, driver.idDriver, driver.balance);

    this.logger.log('Trip found, for driver ' + driver.idDriver, {
      tripReference: trip.tripReference,
    });
    await this.directionService.loadConfig();
    const estimative =
      await this.directionService.getDistanceWithFullAddressGeneralConfig(
        driver.last_lat,
        driver.last_lon,
        trip.startLatitude,
        trip.startLongitude,
      );

    const rewardTrip = await this.mountRewardTrip(
      estimative.distance.value,
      driver.idDriver,
      trip,
    );

    return {
      ...trip,
      tripWayPoints,
      driverValue: driverValue?.driverValue,
      driverBalanceInStartCall: driver.balance,
      tolls,
      riskArea,
      estimative,
      timeLimitToAccept,
      rewardTrip: rewardTrip.value ? { value: rewardTrip.value } : null,
      tripLongDistance: rewardTrip.tripLongDistanceValue
        ? {
            value:
              rewardTrip.tripLongDistanceValue > 0
                ? rewardTrip.tripLongDistanceValue
                : null,
          }
        : null,
    };
  }

  private async insertTripsHistory(
    tripReference: string,
    driverId: number,
    balance: { balance: number },
  ) {
    const tripHistories = await this.tripHistoryRepository.findByTripAndDriver(
      tripReference,
      driverId,
    );

    if (tripHistories.length === 0) {
      await this.tripHistoryRepository.insert(tripReference, driverId, balance);
    }
  }

  private async mountRewardTrip(
    distance: number,
    driverId: number,
    trip: SearchTripQuery,
  ) {
    const rewardTripLongDistance = await this.longDistanceRewardService.insert(
      distance,
      driverId,
      trip,
    );

    let sumReward = await this.getCampaignRewardsValue(trip.tripReference);

    if (rewardTripLongDistance) {
      if (
        (rewardTripLongDistance instanceof TripLongDistanceValue &&
          rewardTripLongDistance.kmDiff == null) ||
        rewardTripLongDistance.value != 0
      ) {
        sumReward += rewardTripLongDistance.value;
      }
    }

    // @TODO: Melhorar a forma de retorno
    return {
      value: sumReward > 0 ? sumReward : null,
      tripLongDistanceValue:
        rewardTripLongDistance instanceof TripLongDistanceValue
          ? rewardTripLongDistance?.kmDiff != null
            ? rewardTripLongDistance
              ? rewardTripLongDistance.value
              : null
            : null
          : null,
    };
  }

  private async getCampaignRewardsValue(tripReference: string): Promise<number> {
    const rewards = await this.rewardCampaignTripRepository.findByTrip(tripReference);

    return rewards
      .map((item) => {
        return item.value;
      })
      .reduce((item1, item2) => {
        return item1 + item2;
      }, 0);
  }

  public async connectedDriver(
    server: Server,
    requestLocationDriver: RequestLocationDriverDto,
  ): Promise<DriverLocationDTO | null> {
    const driver = await this.realTimeDriverConnectionUseCase.execute(
      true,
      requestLocationDriver,
    );

    return driver;
  }

  public async updateLocationDriver(locationDriverDto: RequestLocationDriverDto) {
    return this.driverPositionUseCase.execute(locationDriverDto);
  }

  public async disconnectedDriver(
    client: Socket,
    driverId: number | string,
  ): Promise<void> {
    this.realTimeDriverDisconnectioUseCase.execute(
      new RequestLocationDriverDto({
        driverId: parseInt(driverId as string),
        latitude: null,
        longitude: null,
      }),
    );
  }

  public async getOnlineDrivers(cityId: number): Promise<any[] | null> {
    const driversRecord = await this.stateCacheService.getValuesByPatternWithoutKeys(
      `${DRIVER_LOCATION}*`,
    );

    if (!driversRecord) return null;

    const driversArray = Object.values(driversRecord);
    const filteredDrivers = driversArray.filter(
      (driver: any) => driver?.cityId === cityId,
    );

    if (filteredDrivers.length === 0) return null;
    const cleanedDrivers = filteredDrivers.map((driver: any) => {
      const cleaned = { ...driver };
      delete cleaned.user;
      delete cleaned.balance;
      return cleaned;
    });

    return cleanedDrivers;
  }

  public async getDriverByLastClienId(clientId: string): Promise<Driver> {
    const drivers = await this.stateCacheService.getValuesByPatternWithoutKeys(
      `${DRIVER_LOCATION}*`,
    );
    const driver = drivers.find((driver) => driver?.lastSocketClientId == clientId);

    return driver;
  }

  public async getDriverById(driverId: number): Promise<Driver> {
    const driver = await this.driverRepository.find(driverId);

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found`);
    }

    const cleanedDriver = { ...driver };

    delete cleanedDriver.user;
    delete cleanedDriver.balance;
    return cleanedDriver as Driver;
  }

  public async updateDriverPosition(
    driverId: number,
    position: Point,
  ): Promise<UpdateResult | null> {
    const needsDbSync = await this.driverLocationSyncPolicyService.needsDbSync(
      driverId,
      position,
    );

    if (!needsDbSync) {
      return null;
    }

    return this.driverRepository.updatePosition(driverId, position);
  }
}
