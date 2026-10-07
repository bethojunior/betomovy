<?php

namespace app\exceptions;
use Exception;
use Throwable;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/11/2018
 * Time: 14:51
 */
class ApiTokenException extends Exception
{
    protected $data;

    public function __construct($message = "", $data = null, $code = 0, Throwable $previous = null)
    {
        $this->data = $data;

        parent::__construct($message, $code, $previous);
    }

    public function getData()
    {
        return $this->data;
    }
}