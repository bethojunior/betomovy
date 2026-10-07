<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2019
 * Time: 19:04
 */
class UserIndicationException extends BaseException
{
    protected $keyCode = 'user-indication';
}