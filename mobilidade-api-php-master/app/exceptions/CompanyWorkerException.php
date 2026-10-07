<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/07/2019
 * Time: 10:27
 */
class CompanyWorkerException extends BaseException
{
    protected $keyCode = 'company-worker';
}