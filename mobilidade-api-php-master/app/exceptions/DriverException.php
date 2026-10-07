<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/11/2018
 * Time: 11:49
 */
class DriverException extends BaseException
{
    protected $keyCode = 'driver';
}