<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/03/2020
 * Time: 17:03
 */

namespace App\Constants\Sale;


class SaleStatusConst
{
    const WAITING_PAYMENT = 1;
    const FINISHED = 2;
    const CANCELED = 3;
    const REFUNDED = 4;
    const PAYMENT_REFUSED = 5;
}
