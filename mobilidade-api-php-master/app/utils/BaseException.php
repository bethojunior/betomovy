<?php

namespace app\utils;
use Exception;
use Throwable;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/11/2018
 * Time: 15:52
 */
abstract class BaseException extends Exception
{
    private $codeList;

    protected $keyCode;
    protected $data;

    public function __construct(int $code = 0, $data = null, $message = "", Throwable $previous = null)
    {
        $this->codeList = require '../configs/exceptions/codes.php';
        $this->data = $data;

        $message = $this->codeList[$this->keyCode][$code] ?? $message;

        $this->message = $message;
        $this->code = $code;

        parent::__construct($message, $code, $previous);
    }

    public function getData()
    {
        return $this->data;
    }
}