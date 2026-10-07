<?php

namespace app\exceptions;

use app\utils\BaseException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/08/2019
 * Time: 10:57
 */
class CpfCnpjApiException extends BaseException
{
    protected $keyCode = 'cpf-cnpj-api';
}