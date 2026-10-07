<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/12/2018
 * Time: 17:30
 */
class RequestValidatorException extends BaseException
{
    protected $keyCode = 'request-validator';
}