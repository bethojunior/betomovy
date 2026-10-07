<?php

namespace App\Exceptions\Balance;

use App\Contracts\Exception\CustomException;

class WithdrawTransferException extends CustomException
{
    protected $message = 'Não foi possivel realizar a transferência, verifique od dados e tente novamente.';
}
