<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/05/2019
 * Time: 16:44
 */
class UberException extends BaseException
{
    protected $keyCode = 'api-uber';
}