<?php

namespace App\Exceptions\User\Admin;

use App\Contracts\Exception\CustomException;

class EmailAlreadyExistsException extends CustomException
{
    protected $message = 'E-mail já cadastrado';
}
