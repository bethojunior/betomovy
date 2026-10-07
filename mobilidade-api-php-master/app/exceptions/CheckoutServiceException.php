<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/12/2018
 * Time: 14:44
 */
class CheckoutServiceException extends BaseException
{
    protected $keyCode = 'checkout-service';
}