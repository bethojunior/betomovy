<?php

namespace App\Utils\Pay704\Exceptions;

class NoResponseFromServerException extends Pay704Exception
{
    protected $message = 'Não foi possível obter resposta do servidor. Tente novamente mais tarde.';
}
