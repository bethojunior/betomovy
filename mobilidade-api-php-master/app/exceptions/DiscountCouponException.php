<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 13:45
 */
class DiscountCouponException extends BaseException
{
    protected $keyCode = 'discount-coupon';
}