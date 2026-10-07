<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/12/2018
 * Time: 17:01
 */
class TripPaymentException extends BaseException
{
    protected $keyCode = 'trip-payment';
}