<?php

namespace app\validator;

use app\exceptions\CheckoutCardException;
use app\validator\contracts\ICheckoutValidator;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/11/2019
 * Time: 15:50
 */
class IuguCheckoutValidator implements ICheckoutValidator
{
    private $response;

    /**
     * @param $status
     * @param $status_detail
     * @throws CheckoutCardException
     */
    public function validateTransactionResponse($status, $status_detail)
    {
        $this->response['status'] = $status;
        $this->response['status_detail'] = $status_detail;

        if ($status != 'paid')
            throw new CheckoutCardException(1150, $this->response);
    }
}