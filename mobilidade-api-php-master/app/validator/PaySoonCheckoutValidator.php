<?php

namespace app\validator;

use app\exceptions\CheckoutServiceException;
use app\validator\contracts\ICheckoutValidator;

class PaySoonCheckoutValidator implements ICheckoutValidator
{

    public function validateTransactionResponse($status, $status_detail)
    {
        $this->response['status'] = $status;
        $this->response['status_detail'] = $status_detail;

        if (!$status) {
            throw new CheckoutServiceException(150, $this->response);
        }
    }
}