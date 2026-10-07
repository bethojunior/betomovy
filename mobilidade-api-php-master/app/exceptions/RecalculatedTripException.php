<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/07/2019
 * Time: 16:45
 */
class RecalculatedTripException extends BaseException
{
    protected $keyCode = 'recalculated-trip';
}