<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/09/2019
 * Time: 15:10
 */
class FreightException extends BaseException
{
    protected $keyCode = 'freight';
}