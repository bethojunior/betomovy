import { Inject, Injectable } from '@nestjs/common';
import { StateCacheService } from 'src/modules/state/state.service';
import { PositionHelper } from 'src/modules/utils/helpers/position.helper';
import { DRIVER_LOCATION_DB_SYNC } from '../constants/cacheKeyConstants';

const DB_SYNC_THROTTLE_SECONDS = 60;
const DB_SYNC_DISTANCE_METERS = 100;

@Injectable()
export class DriverLocationSyncPolicyService {
  constructor(
    @Inject(StateCacheService)
    private readonly stateCacheService: StateCacheService,
    @Inject(PositionHelper)
    private readonly positionHelper: PositionHelper,
  ) {}

  async needsDbSync(driverId: number, position: Point): Promise<boolean> {
    const syncKey = `${DRIVER_LOCATION_DB_SYNC}${driverId}`;
    const lastSynced = await this.stateCacheService.getItem<Point>(syncKey);

    const needsSync =
      !lastSynced ||
      typeof lastSynced.lat !== 'number' ||
      typeof lastSynced.lng !== 'number' ||
      this.positionHelper.getDistanceFromLatLonInMeter(lastSynced, position) >=
        DB_SYNC_DISTANCE_METERS;

    if (needsSync) {
      await this.stateCacheService.setItem(
        syncKey,
        JSON.stringify(position),
        DB_SYNC_THROTTLE_SECONDS,
      );
    }

    return needsSync;
  }
}
