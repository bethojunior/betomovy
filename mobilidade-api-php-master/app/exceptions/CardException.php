<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/11/2018
 * Time: 17:13
 */
class CardException extends BaseException
{
    protected $keyCode = 'card';
}