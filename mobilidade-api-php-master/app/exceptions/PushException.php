<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/11/2018
 * Time: 15:31
 */
class PushException extends BaseException
{
    protected $keyCode = 'push-notification';
}