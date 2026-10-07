<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/06/2020
 * Time: 16:09
 */

namespace App\Constants\Delivery;


class DeliveryOrderStatusConst
{
    const WAITING_CONFIRMATION = 1;
    const ORDER_CONFIRMED = 2;
    const IN_PREPARATION = 3;
    const SEARCHING_DELIVERY_MAN = 4;
    const ORDER_ACCEPTED_DELIVERY_MAN = 5;
    const WITHDRAWING_ORDER = 6;
    const OUT_FOR_DELIVERY = 7;
    const ARRIVED = 8;
    const DELIVERED = 9;
    const RETURNING = 10;
    const CANCELED = 11;
    const FINISHED = 12;
    const REFUSED = 13;
}
