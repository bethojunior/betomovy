<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/11/2018
 * Time: 15:59
 */
class PriceException extends BaseException
{
    protected $keyCode = 'price';
}