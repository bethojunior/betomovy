<?php

namespace app\exceptions;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/10/2018
 * Time: 11:33
 */
class InvalidFieldEmployeeException extends Exception
{
    private $data;

    public function __construct(string $message = "", $data = null)
    {
        $this->data = is_string($data) ? "employee." . $data : $data;
        parent::__construct($message);
    }

    /**
     * @return null
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @param null $data
     */
    public function setData($data): void
    {
        $this->data = $data;
    }
}