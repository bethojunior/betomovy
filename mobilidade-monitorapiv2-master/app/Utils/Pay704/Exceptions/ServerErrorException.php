<?php

namespace App\Utils\Pay704\Exceptions;

class ServerErrorException extends Pay704Exception
{
    protected $message = 'Erro interno no servidor da 704Pay. Tente novamente mais tarde.';
}
