<?php

namespace app\exceptions;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/10/2018
 * Time: 10:26
 */
class InvalidFieldPlaceException extends Exception
{
    private $data;

    public function __construct(string $message = "", $data = null)
    {
        $this->data = is_string($data) ? "place." . $data : null;
        parent::__construct($message);
    }

    /**
     * @return null|string
     */
    public function getData(): ?string
    {
        return $this->data;
    }

    /**
     * @param null|string $data
     * @return InvalidFieldPlaceException
     */
    public function setData(?string $data): InvalidFieldPlaceException
    {
        $this->data = $data;
        return $this;
    }

}