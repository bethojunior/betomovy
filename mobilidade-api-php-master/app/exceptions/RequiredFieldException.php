<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/08/2019
 * Time: 10:52
 */
class RequiredFieldException extends BaseException
{
    protected $keyCode = 'required-field';
}