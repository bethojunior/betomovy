<?php

namespace app\constant;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/11/2018
 * Time: 14:09
 */
class PushTagConst
{
    const DRIVERS_CLOSE = 'notifyDriversClose';
    const CHAT_MESSAGE = 'chatMessage';
    const NOTIFY_CUSTOMER_ON_TRIP_EXPIRED = 'notifyCustomerOnTripExpired';
    const REQUEST_UPDATE_DRIVER_LOCATION = 'requestUpdateDriverLocation';

    const UPDATE_DRIVER_INFO = 'updateDriverInfo';
    const STOP_CALL = 'stopCall';
    const CUSTOMERS_CLOSE = "notifyCustomersClose";
    
    const RIDE_REQUEST = "rideRequest";
    const RIDE_OFFER = "rideOffer";
    const RIDE_CANCELLED = "rideCancelled";
    const SCHEDULED_RIDE = "scheduledRide";
    const CUSTOMER_CHANGED_ROUTE = "customerChangedRoute";
}