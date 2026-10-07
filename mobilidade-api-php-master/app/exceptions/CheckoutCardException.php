<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/12/2018
 * Time: 17:31
 */
class CheckoutCardException extends BaseException
{
    protected $keyCode = 'checkout-card-validator';
}