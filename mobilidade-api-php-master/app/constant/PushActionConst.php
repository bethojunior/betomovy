<?php

namespace app\constant;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/11/2018
 * Time: 17:12
 */
class PushActionConst
{
    const CHANGE_STATUS_DRIVER = "changeStatusDriver";
    const PENDENCY_LINK = "pendencelink";
    const OPEN_APP_ON_DRIVER_ARRIVAL = "openAppOnDriverArrival";
    const OPEN_APP = "openApp";
    const CANCEL_TRIP = "cancelTrip";
    const NOTIFY_CUSTOMER_ON_TRIP_EXPIRED = "notifyCustomerOnTripExpired";

    const UPDATE_DRIVER_INFO = "updateDriverInfo";
    const STOP_CALL = "stopCall";

    const NOTIFY_DEFAULT = "notifyApp";

    const SHOW_POSITION = "showPosition";
    const NEW_NOTIFICATION_APP = "newNotificationApp";
    const NOTIFY_CUSTOMER_BEEN_TRIP_ACCEPTED_SCHEDULED = "notifyCustomerBeenTripAcceptedScheduled";
    const CUSTOMER_RELEASED = "customerReleased";
    const UPDATE_BALANCE = "updateBalance";
}