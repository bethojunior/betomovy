<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/03/2019
 * Time: 13:57
 */
class RefusedCustomerException extends BaseException
{
    protected $keyCode = 'refused-customer';
}