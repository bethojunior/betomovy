<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/12/2019
 * Time: 13:11
 */
class RouteException extends BaseException
{
    protected $keyCode = 'route';
}