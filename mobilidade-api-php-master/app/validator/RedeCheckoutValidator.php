<?php

namespace app\validator;

use app\exceptions\CheckoutCardException;
use app\validator\contracts\ICheckoutValidator;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/03/2020
 * Time: 08:59
 */
class RedeCheckoutValidator implements ICheckoutValidator
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

        if ($status != "00")
            $this->validateStatusRejected($status);
    }

    /**
     * @param $status
     * @throws CheckoutCardException
     */
    private function validateStatusRejected($status)
    {
        switch ($status) {
            case 53:
            case 58:
            case 69:
            case 72:
            case 113:
            case 116:
                throw new CheckoutCardException(1151, $this->response);
            case 64:
            case 103:
            case 104:
            case 106:
            case 107:
            case 121:
                throw new CheckoutCardException(1193, $this->response);
            case 84:
                throw new CheckoutCardException(1176, $this->response);
            case 101:
            case 105:
                throw new CheckoutCardException(1150, $this->response);
            case 108:
                throw new CheckoutCardException(1184, $this->response);
            case 109:
                throw new CheckoutCardException(1160, $this->response);
            case 110:
                throw new CheckoutCardException(1170, $this->response);
            case 111:
                throw new CheckoutCardException(1152, $this->response);
            case 112:
                throw new CheckoutCardException(1154, $this->response);
            case 115:
                throw new CheckoutCardException(1159, $this->response);
            case 118:
                throw new CheckoutCardException(1165, $this->response);
            case 119:
                throw new CheckoutCardException(1169, $this->response);
            default:
                throw new CheckoutCardException(1191, $this->response);
        }
    }
}