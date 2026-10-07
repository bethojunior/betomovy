<?php

namespace app\exceptions;

use app\utils\BaseException;

class IpagException extends BaseException
{
    protected $keyCode = 'ipag-return-code';
}