<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/11/2018
 * Time: 14:21
 */
class CustomerException extends BaseException
{
    protected $keyCode = 'customer';
}