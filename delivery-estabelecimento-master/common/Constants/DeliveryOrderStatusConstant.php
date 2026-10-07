<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/06/2020
 * Time: 11:00
 */

namespace Common\Constants;


class DeliveryOrderStatusConstant
{
    const WAITING_CONFIRMATION = 1;
    const CONFIRMED = 2;
    const IN_PREPARATION = 3;
    const SEARCH_DELIVERY_MAN = 4;
    const ORDER_ACCEPTED_DELIVERY_MAN = 5;
    const WITHDRAWING_ORDER = 6;
    const OUT_FOR_DELIVERY = 7;
    const ARRIVED = 8;
    const DELIVERED = 9;
    const RETURNING = 10;
    const CANCELED = 11;
    const FINISHED = 12;
    const REFUSED = 13;
    const WITHDRAW_IN_LOCAL = 14;
}
