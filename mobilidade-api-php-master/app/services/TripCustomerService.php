<?php

namespace app\services;

use app\constant\TripPaymentFormConst;
use app\utils\FormatValue;
use app\utils\PhoneMessage;
use app\model\Config;
use app\model\ConfigType;
use app\model\Trip;
use app\model\TripCustomer;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/05/2019
 * Time: 15:30
 */
class TripCustomerService
{
    public function notifyOnDriverArrival(Trip $trip, TripCustomer $tripCustomer)
    {
        $key = $trip->getTripPaymentFormId() == TripPaymentFormConst::MONEY_IN_CAR ?
            'sms_to_customer_in_driver_arrival_money_in_car' : 'sms_to_customer_in_driver_arrival';

        $configMessage = Config::get($key, ConfigType::TRIP);

        $customerName = explode(' ', $tripCustomer->getName());
        $configMessage = str_replace('{name}', $customerName[0], $configMessage);
        $configMessage = str_replace('{trip_value}', FormatValue::formatForReal($trip->getPrice()), $configMessage);
        $configMessage = str_replace('{id_trip}', base64_encode($trip->getIdTrip()), $configMessage);

        $phoneMessage = new PhoneMessage($tripCustomer->getPhone(), $configMessage, null, $trip->getCityId() ?? null);
        return [
            'result_sms' => $phoneMessage->send(),
            'message' => $configMessage
        ];
    }
}