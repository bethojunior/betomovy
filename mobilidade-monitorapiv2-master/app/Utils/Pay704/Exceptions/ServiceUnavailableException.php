<?php

namespace App\Utils\Pay704\Exceptions;

class ServiceUnavailableException extends Pay704Exception
{
    protected $message = 'Serviço indisponível. Tente novamente mais tarde.';
}
