<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2019
 * Time: 11:13
 */

return [
    'teste'                             => 'TesteCommand',
    'trip-management'                   => 'TripManagementCommand',
    'remove-expired-blacklist'          => 'UserBlacklistManagementCommand',
    'generate-hash'                     => 'HashApiTokenCommand',
    'trip-call'                         => 'TripCallDriverCommand',
    'trip-call-scheduled'               => 'CallTripScheduledCommand',
    'start-websocket'                   => 'WebSocketPresenceCommand',
    'clear-negative-driver-balances'    => 'BalanceAdjustmentCommand',
    'sync-trip-card-payment'            => 'TripCardPaymentCommand',
    'sync-drivers-active'               => 'UpdateDriverPositionCommand',
    'bill-cancellation-fees'            => 'BillCancellationFeesCommand',
    'clear-driver-penalties'            => 'ClearUserPenaltyCommand',
    'release-blocked-trips'             => 'ReleaseBlockedTripsCommand',
    'price-comparision'                 => 'PriceComparisionCommand',
    'driver-leveling'                   => 'DriverLevelingCommand',
    'notify-incomplete-customers'       => 'NotifyIncompleteCustomersCommand',
    'fee-devolution-drivers-indicated'  => 'FeeDevolutionOfDriversIndicatedCommand',
    'test-push'                         => 'TestePushCommand',
    'notify-admins'                     => 'NotifyAdminsCommand',
    'sync-trips-realtime'               => 'SyncRealtimeTripCommand',
    'find-driver-position'              => 'FindDriverPositionCommand',
    'save-location'                     => 'SaveLocationCommand',
    'update-drivers-position'           => 'UpdateDriversPositionCommand',
    'send-delivery-message'             => 'SendDeliveryMessageCommand',
    'send-ride-message'                 => 'SendRideMessageCommand',
    'notify-service-change'             => 'NotifyServiceChangeCommand',
    'update-quantity-trips'             => 'UpdateQuantityTripsCommand',
    'save-route-tracing'                => 'SaveRouteTracingCommand',
    'queue-finished-trip'               => 'QueueFinishedTripCommand',
    'cleanup-finished-trip-realtime'    => 'CleanupFinishedTripRealtimeCommand',
    'avg-finished-trip'                 => 'QueueFinishedTripCommand',
    'trip-refund-card-payment'          => 'TripRefundCardPaymentCommand',
    'find-geocoding'                    => 'FindGeocodingCommand',
    'notify-drivers-new-bid'            => 'NotifyDriversNewBidCommand',
    'send-central-trip-info-message'    => 'SendCentralTripInfoMessageCommand',
    'event-trip-webhook'                => 'EventTripWebhookCommand',
    'check-trips-for-looping-calls'     => 'CheckTripsForLoopingCallsCommand',
    'run-queue-job'                     => 'RunQueueJobCommand',
];