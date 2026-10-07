<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/05/2019
 * Time: 17:40
 */
class CommissionException extends BaseException
{
    protected $keyCode = 'commission';
}