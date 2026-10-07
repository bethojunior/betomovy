<?php

namespace app\exceptions;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/10/2018
 * Time: 10:26
 */
class InvalidFieldCustomerPartnerException extends Exception
{
    private $data;

    public function __construct(string $message = "", $data = null)
    {
        $this->data = is_string($data) ? "customerPartner." . $data : $data;
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
     * @return InvalidFieldCustomerPartnerException
     */
    public function setData(?string $data): InvalidFieldCustomerPartnerException
    {
        $this->data = $data;
        return $this;
    }
}