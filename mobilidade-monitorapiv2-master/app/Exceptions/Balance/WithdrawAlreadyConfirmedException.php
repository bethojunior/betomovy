<?php

namespace App\Exceptions\Balance;

use App\Contracts\Exception\CustomException;

class WithdrawAlreadyConfirmedException extends CustomException
{
    protected $message = 'Transferência já confirmada';
}
