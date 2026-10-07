export enum TripEventsType {
  'trip-created' = 'trip-created',
  'trip-updated' = 'trip-updated',
  'trip-deleted' = 'trip-deleted',
}

export enum TripEvents {
  TripAvailable = 'trip-available',
  TripAccepted = 'trip-accepted',
  TripUpdated = 'trip-updated',
  TripUpdatedList = 'trip-updated-list',
  TripScheduledAccepted = 'trip-scheduled-accepted',
  TripScheduledAcceptedReady = 'trip-scheduled-accepted-ready',
  TripUpdatedStatus = 'trip-updated-status',
  TripScheduledAvailable = 'trip-scheduled-available',
  TripOfferAvailable = 'trip-offer-available',
  TripCanceled = 'trip-canceled',
}

export type PayloadType = 'added' | 'modified' | 'removed';
