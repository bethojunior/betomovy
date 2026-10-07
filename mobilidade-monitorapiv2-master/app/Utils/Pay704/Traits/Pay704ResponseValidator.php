<?php

namespace App\Utils\Pay704\Traits;

use App\Utils\Pay704\Exceptions\Pay704Exception;
use App\Utils\Pay704\Exceptions\ServerErrorException;
use App\Utils\Pay704\Exceptions\ServiceUnavailableException;

trait Pay704ResponseValidator
{
    /**
     * @param string $errorCode
     * @return void
     * @throws Pay704Exception
     */
    protected function validateErrorCode(string $errorCode): void
    {
        if ($errorCode == "ESRI0006") {
            throw new ServiceUnavailableException();
        }

        throw new ServerErrorException();
    }
}
