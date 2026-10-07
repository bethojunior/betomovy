<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/11/2018
 * Time: 10:32
 */
class TripException extends BaseException
{
    protected $keyCode = 'trip';
}