<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/01/2019
 * Time: 14:28
 */
class CustomerPlaceException extends BaseException
{
    protected $keyCode = 'customer-place';
}