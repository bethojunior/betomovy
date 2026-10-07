<?php

namespace app\validator;

use app\exceptions\CheckoutServiceException;
use app\validator\contracts\ICheckoutValidator;

class ZspayCheckoutValidator implements ICheckoutValidator
{

    public function validateTransactionResponse($status, $status_detail)
    {
        $this->response['status'] = $status;
        $this->response['status_detail'] = $status_detail;

        if (!$status) {
            throw new CheckoutServiceException(150, $this->response);
        }

        if ($status_detail == 11 || $status_detail == 12) {
            throw new CheckoutServiceException(1191, $this->response);
        }

        if ($status_detail != 2) {
            throw new CheckoutServiceException(150, $this->response);
        }
    }
}