export enum PushNotificationTags {
  DRIVERS_CLOSE = 'notifyDriversClose',
  CHAT_MESSAGE = 'chatMessage',
  NOTIFY_CUSTOMER_ON_TRIP_EXPIRED = 'notifyCustomerOnTripExpired',
  REQUEST_UPDATE_DRIVER_LOCATION = 'requestUpdateDriverLocation',
  UPDATE_DRIVER_INFO = 'updateDriverInfo',
  STOP_CALL = 'stopCall',
  CUSTOMERS_CLOSE = 'notifyCustomersClose',
  RIDE_REQUEST = 'rideRequest',
  RIDE_OFFER = 'rideOffer',
  RIDE_CANCELLED = 'rideCancelled',
  SCHEDULED_RIDE = 'scheduledRide',
  CUSTOMER_CHANGED_ROUTE = 'customerChangedRoute'
}

export enum PushNotificationAction {
  CHANGE_STATUS_DRIVER = 'changeStatusDriver',
  PENDENCY_LINK = 'pendencelink',
  OPEN_APP_ON_DRIVER_ARRIVAL = 'openAppOnDriverArrival',
  OPEN_APP = 'openApp',
  CANCEL_TRIP = 'cancelTrip',
  NOTIFY_CUSTOMER_ON_TRIP_EXPIRED = 'notifyCustomerOnTripExpired',
  UPDATE_DRIVER_INFO = 'updateDriverInfo',
  STOP_CALL = 'stopCall',
  NOTIFY_DEFAULT = 'notifyApp',
  SHOW_POSITION = 'showPosition',
  NEW_NOTIFICATION_APP = 'newNotificationApp',
  NOTIFY_CUSTOMER_BEEN_TRIP_ACCEPTED_SCHEDULED = 'notifyCustomerBeenTripAcceptedScheduled',
  UDATE_STATUS_DOCUMENTS = 'updateStatusDocuments',
  CUSTOMER_RELEASED = 'customerReleased',
}

export const BACKGROUND_NOTIFICATION_TASK = 'background-notification-task';
export const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
