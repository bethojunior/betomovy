<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/03/2019
 * Time: 17:41
 */
class RefusedDriverException extends BaseException
{
    protected $keyCode = 'refused-driver';
}