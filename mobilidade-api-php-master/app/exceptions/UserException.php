<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/11/2018
 * Time: 10:51
 */
class UserException extends BaseException
{
    protected $keyCode = 'user';
}