<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/07/2020
 * Time: 15:13
 */

namespace Cash\Exceptions\BalanceTransfer;


use App\Contracts\Exception\CustomException;

class InsufficientBalanceException extends CustomException
{
    protected $message = "Saldo insuficiente";
}
