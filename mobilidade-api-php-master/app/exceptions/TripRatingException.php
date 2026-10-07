<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2019
 * Time: 11:56
 */
class TripRatingException extends BaseException
{
    protected $keyCode = 'trip-rating';
}