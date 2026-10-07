<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/05/2019
 * Time: 14:22
 */
class AppSharingException extends BaseException
{
    protected $keyCode = 'app-sharing';
}