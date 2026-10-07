<?php

namespace app\validator;

use app\exceptions\CheckoutCardException;
use app\validator\contracts\ICheckoutValidator;
use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/12/2019
 * Time: 19:25
 */
class GetnetCheckoutValidator implements ICheckoutValidator
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

        if ($status != 'APPROVED')
            $this->validateStatusRejected($status);
    }

    /**
     * @param $status
     * @throws CheckoutCardException
     * @throws Exception
     */
    private function validateStatusRejected($status)
    {
        switch ($status) {
            case 'PAYMENTS-113':
                throw new CheckoutCardException(1152, $this->response);

            case 'PAYMENTS-026':
                throw new CheckoutCardException(1156, $this->response);

            case '481':
                throw new CheckoutCardException(1192, $this->response);

            case 'PAYMENTS-021':
            case 'PAYMENTS-116':
            case 'PAYMENTS-008':
                throw new CheckoutCardException(1194, $this->response);

            default:
                throw new CheckoutCardException(1150, $this->response);
        }
    }
}