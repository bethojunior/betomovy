<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/12/2018
 * Time: 11:50
 */
class TransactionException extends BaseException
{
    protected $keyCode = 'transaction';
}