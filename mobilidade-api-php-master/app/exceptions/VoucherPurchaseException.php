<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/12/2018
 * Time: 17:27
 */
class VoucherPurchaseException extends BaseException
{
    protected $keyCode = "voucher-purchase";
}