<?php

namespace app\exceptions;

use RuntimeException;
use Throwable;

class MercadoPagoException extends RuntimeException
{
    private ?array $responseBody;

    public function __construct(string $message, int $httpCode = 0, ?array $responseBody = null, Throwable $previous = null)
    {
        $this->responseBody = $responseBody;
        
        parent::__construct('[MercadoPago] ' . $message, $httpCode, $previous);
    }

    public function getResponseBody(): ?array
    {
        return $this->responseBody;
    }

}
