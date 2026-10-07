<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/11/2018
 * Time: 15:36
 */
class WithdrawException extends BaseException
{
    protected $keyCode = 'withdraw';
}