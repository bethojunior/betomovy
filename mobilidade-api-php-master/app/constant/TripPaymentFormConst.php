<?php

namespace app\constant;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/10/2018
 * Time: 17:31
 */
class TripPaymentFormConst
{
    const VOUCHER = 1;
    const MONEY_IN_CAR = 2;
    const CREDIT_CARD = 3;

    const ELECTRONIC_PAYMENTS = [
        self::VOUCHER, self::CREDIT_CARD
    ];
}