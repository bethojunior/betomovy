<?php

namespace app\validator;

use app\exceptions\CheckoutCardException;
use app\validator\contracts\ICheckoutValidator;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/11/2019
 * Time: 16:04
 */
class RecebeAquiCheckoutValidator implements ICheckoutValidator
{
    private $response;

    /**
     * @param $status
     * @param $status_detail
     * @throws CheckoutCardException
     */
    public function validateTransactionResponse($status, $status_detail)
    {
        // TODO: Implement validateTransactionResponse() method.
        $this->response['status'] = $status;
        $this->response['status_detail'] = $status_detail;

        if (!$status)
            throw new CheckoutCardException(1191, $this->response);
    }
}