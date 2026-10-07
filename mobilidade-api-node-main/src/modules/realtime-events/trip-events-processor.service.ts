import { Injectable, Logger } from '@nestjs/common';
import { TripEventDto } from './dto/trip-events.dto';
import { EventsGateway } from '../events/events.gateway';
import { RealtimeEventsHelper, Payload } from './realtime-events.helper';
import { StateCacheService } from '../state/state.service';
import { TripRepository } from '../trip/repositories';
import { TripEvents } from './trip-events-type.enum';
import { ProcessorContext } from './realtime-events.interface';

@Injectable()
export class TripEventsProcessorService {
  private readonly logger = new Logger(TripEventsProcessorService.name);

  constructor(
    private readonly eventsGateway: EventsGateway,
    private readonly stateCacheService: StateCacheService,
    private readonly tripRepository: TripRepository,
  ) {}

  async process(data: TripEventDto) {
    const payloadType = RealtimeEventsHelper.mapEventToPayloadType(data.event);
    const payload = { data: data.trip, type: payloadType };

    const context = await this.createProcessorContext(payload);

    this.emitTripSearchingDrivers(payload, context);
    this.emitTripUpdated(payload, context);
    this.emitTripAccepted(payload);
    this.emitTripUpdatedStatus(payload, context);

    this.emitScheduledTripAvailable(payload, context);
    this.emitScheduledTripAccepted(payload, context);
    this.emitScheduledTripAcceptedReady(payload, context);

    this.emitOfferTripAvailable(payload, context);

    await this.manageCache(data, payload, context);
  }

  private async createProcessorContext(payload: Payload): Promise<ProcessorContext> {
    const redisKey = `trip:${payload.data?.tripReference}`;
    const tripPrevious = await this.stateCacheService.getItem<any>(redisKey);
    const tripReference = payload.data?.tripReference;

    return { redisKey, tripPrevious, tripReference, ttl: 2 * 3600 };
  }

  private async manageCache(data: TripEventDto, payload: Payload, ctx: ProcessorContext) {
    if (!ctx.redisKey) return;

    if (data.event === 'trip-created' || data.event === 'trip-updated') {
      const schedule = data.trip.schedule;
      const date = schedule?.scheduleUTC || schedule?.schedule;

      let ttl = ctx.ttl;

      if (schedule && date) {
        const scheduleDate = new Date(date);
        const timeToExpire = scheduleDate.getTime() - Date.now() + 60000;

        if (timeToExpire > 0) {
          ttl = timeToExpire;
        }
      }

      this.logger.log(`Trip TTL (seconds): ${ttl}`);

      this.stateCacheService.setItem(ctx.redisKey, JSON.stringify(data.trip), ttl);
    } else if (data.event === 'trip-deleted') {
      this.emitTripCanceled(payload, ctx);
      this.stateCacheService.delItem(ctx.redisKey);
    }
  }

  private emitTripUpdated(payload: Payload, ctx: ProcessorContext): void {
    const isRemoved = payload.type === 'removed';
    const userId = isRemoved ? ctx.tripPrevious?.userId : payload?.data?.userId;
    const driverId = isRemoved ? ctx.tripPrevious?.driverId : payload?.data?.driverId;
    const cityId = isRemoved ? ctx.tripPrevious?.cityId : payload?.data?.cityId;

    this.sendBoth(userId, driverId, TripEvents.TripUpdated, payload);
    this.sendBoth(userId, driverId, TripEvents.TripUpdatedList, [payload]);
    this.eventsGateway.sendToCity(cityId, TripEvents.TripUpdated, payload);
    this.eventsGateway.sendToCity(cityId, TripEvents.TripUpdatedList, [payload]);
  }

  private emitTripSearchingDrivers(payload: Payload, ctx: ProcessorContext): void {
    const isRemoved = payload.type === 'removed';
    const tripPrevious = ctx.tripPrevious;

    const { data } = payload;
    const isSearchingStatus = ['searching', 'searching_favorite'].includes(data?.status);
    const wasSearchingStatus = ['searching', 'searching_favorite'].includes(
      tripPrevious?.status,
    );

    if (isSearchingStatus) {
      const driverIds = RealtimeEventsHelper.extractCallingDriverIds(payload.data);

      driverIds.forEach((driverId: string) => {
        this.eventsGateway.sendToDriver(driverId, TripEvents.TripAvailable, payload);
      });
    }

    if (
      wasSearchingStatus &&
      (isRemoved || tripPrevious.status !== payload.data?.status)
    ) {
      const driverIds = RealtimeEventsHelper.extractCallingDriverIds(tripPrevious);

      driverIds.forEach((driverId: string) => {
        this.eventsGateway.sendToDriver(driverId, TripEvents.TripAvailable, {
          data: { tripReference: ctx.tripReference },
          type: 'removed',
        });
      });
    }
  }

  private emitTripAccepted(payload: Payload): void {
    const userId = payload.data.userId;
    const driverId = payload.data.driverId;
    const status = payload.data?.status;
    const isTripSchedule = RealtimeEventsHelper.isTripSchedule(payload?.data);

    if (
      ['accepted', 'boarding'].includes(status) &&
      !!driverId &&
      !!userId &&
      !isTripSchedule
    ) {
      this.sendBoth(userId, driverId, TripEvents.TripAccepted, payload);
    }
  }

  private emitTripUpdatedStatus(payload: Payload, ctx: ProcessorContext): void {
    const userId = payload.data.userId || ctx.tripPrevious?.userId;
    const driverId = payload?.data?.driverId || ctx.tripPrevious?.driverId;
    const status = payload.data?.status;

    if (ctx.tripPrevious?.status !== status) {
      this.sendBoth(userId, driverId, TripEvents.TripUpdatedStatus, payload);
    }
  }

  private emitOfferTripAvailable(payload: Payload, ctx: ProcessorContext): void {
    const { data } = payload;
    const tripPrev = ctx.tripPrevious;

    const prevStatus = tripPrev?.status;
    const tripTypeId = data?.tripTypeId || tripPrev?.tripTypeId;
    const hasDriver = !!data?.driver;

    const isOfferStage = (s?: string) => s === 'get_bid_by_drivers';

    if (isOfferStage(data?.status) && !hasDriver) {
      this.eventsGateway.sendToCity(
        data?.cityId,
        TripEvents.TripOfferAvailable,
        payload,
        tripTypeId,
      );
    }

    const shouldEmitRemoved =
      prevStatus &&
      isOfferStage(prevStatus) &&
      (payload.type === 'removed' || !isOfferStage(data?.status));

    if (shouldEmitRemoved) {
      this.eventsGateway.sendToCity(
        data?.cityId || tripPrev?.cityId,
        TripEvents.TripOfferAvailable,
        { data: { tripReference: ctx.tripReference }, type: 'removed' },
        tripTypeId,
      );
    }
  }

  private async emitTripCanceled(payload: Payload, ctx: ProcessorContext): Promise<void> {
    if (payload.type !== 'removed') return;

    try {
      const trip = await this.tripRepository.getTripOff(ctx.tripReference);
      if (!!trip) {
        this.sendBoth(trip?.userId, trip?.driverId, TripEvents.TripCanceled, payload);
      }
    } catch (error) {
      this.logger.error('Error getting trip canceled', error);
    }
  }

  private emitScheduledTripAvailable(payload: Payload, ctx: ProcessorContext): void {
    if (payload.data?.status === 'scheduled' && !payload.data?.driver) {
      this.eventsGateway.sendToCity(
        payload.data?.cityId,
        TripEvents.TripScheduledAvailable,
        payload,
        payload.data?.tripTypeId,
      );

      if (ctx.tripPrevious?.status === 'scheduled' && !!ctx.tripPrevious?.driver) {
        this.sendBoth(
          ctx.tripPrevious?.userId,
          ctx.tripPrevious?.driverId,
          TripEvents.TripScheduledAccepted,
          { data: { tripReference: ctx.tripReference }, type: 'removed' },
        );
      }
    }

    if (
      payload.type === 'removed' &&
      ctx.tripPrevious?.status === 'scheduled' &&
      !ctx.tripPrevious?.driver
    ) {
      this.eventsGateway.sendToCity(
        payload.data?.cityId || ctx.tripPrevious?.cityId,
        TripEvents.TripScheduledAvailable,
        { data: { tripReference: ctx.tripReference }, type: 'removed' },
        payload.data?.tripTypeId || ctx.tripPrevious?.tripTypeId,
      );
    }
  }

  private emitScheduledTripAccepted(payload: Payload, ctx: ProcessorContext): void {
    if (payload.data?.status === 'scheduled' && !!payload.data?.driver) {
      this.eventsGateway.sendToCity(
        payload.data?.cityId,
        TripEvents.TripScheduledAvailable,
        { data: { tripReference: ctx.tripReference }, type: 'removed' },
        payload.data?.tripTypeId,
      );

      this.sendBoth(
        payload.data?.userId,
        payload.data?.driverId,
        TripEvents.TripScheduledAccepted,
        payload,
      );
    }

    if (
      payload.type === 'removed' &&
      ctx.tripPrevious?.status === 'scheduled' &&
      !!ctx.tripPrevious?.driver
    ) {
      this.sendBoth(
        payload.data?.userId || ctx.tripPrevious?.userId,
        payload.data?.driverId || ctx.tripPrevious?.driverId,
        TripEvents.TripScheduledAccepted,
        { data: { tripReference: ctx.tripReference }, type: 'removed' },
      );
    }
  }

  private emitScheduledTripAcceptedReady(payload: Payload, ctx: ProcessorContext): void {
    const status = payload.data?.status;
    const isTripSchedule = RealtimeEventsHelper.isTripSchedule(payload?.data);

    if (status === 'accepted' && isTripSchedule) {
      this.sendBoth(
        payload.data?.userId,
        payload.data?.driverId,
        TripEvents.TripScheduledAccepted,
        { data: { tripReference: ctx.tripReference }, type: 'removed' },
      );

      this.sendBoth(
        payload.data?.userId,
        payload.data?.driverId,
        TripEvents.TripScheduledAcceptedReady,
        payload,
      );
    }
  }

  private sendBoth(userId: string, driverId: string, event: TripEvents, payload: any) {
    if (userId) this.eventsGateway.sendToUser(userId, event, payload);
    if (driverId) this.eventsGateway.sendToDriver(driverId, event, payload);
  }
}
