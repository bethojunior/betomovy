<?php

namespace app\services;

use app\constant\CustomerPartnerBalanceConst;
use app\dao\BalanceDao;
use app\services\contracts\TripPaymentService;
use Exception;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/12/2018
 * Time: 11:00
 */
class PartnerTripPaymentService extends TripPaymentService
{
    protected function voucherPayment(&$customer, Trip $trip)
    {
        $totalBalance = (float)($customer->tripBalance ?? 0) + (float)($customer->balance ?? 0);
        if ($totalBalance < (float)$trip->getPrice()) {
            throw new Exception("Cliente não possui saldo suficiente");
        }

        $customer->balance = (new BalanceDao)
            ->subBalanceForNewTrip(
                $customer->balanceId, $trip, CustomerPartnerBalanceConst::TRIP_BALANCE_LOCKOUT);
    }
}