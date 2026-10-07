<?php

namespace App\Exceptions\Driver;

use App\Contracts\Exception\CustomException;

class DriverBankAccountNotFoundException extends CustomException
{
    protected $message = 'Conta bancária do motorista não encontrada. Cadastre uma conta bancária para o motorista.';
}
