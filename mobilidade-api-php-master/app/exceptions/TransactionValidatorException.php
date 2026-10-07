<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/12/2018
 * Time: 10:46
 */
class TransactionValidatorException extends BaseException
{
    protected $keyCode = 'transaction-validator';
}