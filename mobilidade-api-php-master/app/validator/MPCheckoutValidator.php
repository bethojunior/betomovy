<?php

namespace app\validator;

use app\constant\CheckoutStatusConst;
use app\constant\CheckoutStatusDetailConst;
use app\exceptions\CheckoutCardException;
use app\validator\contracts\ICheckoutValidator;
use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/09/2019
 * Time: 10:37
 */
class MPCheckoutValidator implements ICheckoutValidator
{
    private $response;

    /**
     * @param $status
     * @param $status_detail
     * @throws CheckoutCardException
     */
    public function validateTransactionResponse($status, $status_detail): void
    {
        $this->response['status'] = $status;
        $this->response['status_detail'] = $status_detail;

        switch ($status) {
            case CheckoutStatusConst::REJECTED:
                $this->validateStatusRejected($status_detail);
            case CheckoutStatusConst::IN_PROCESS:
                throw new CheckoutCardException(1156, $this->response);
        }
    }

    /**
     * @param $status_detail
     * @throws CheckoutCardException
     * @throws Exception
     */
    private function validateStatusRejected($status_detail)
    {
        switch ($status_detail) {
            case CheckoutStatusDetailConst::CC_REJECTED_BAD_FILLED_CARD_NUMBER:
                throw new CheckoutCardException(1160, $this->response);

            case CheckoutStatusDetailConst::CC_REJECTED_BAD_FILLED_SECURITY_CODE:
                throw new CheckoutCardException(1153, $this->response);

            case CheckoutStatusDetailConst::CC_REJECTED_BAD_FILLED_DATE:
                throw new CheckoutCardException(1154, $this->response);

            case CheckoutStatusDetailConst::CC_REJECTED_BAD_FILLED_OTHER:
                throw new CheckoutCardException(1155, $this->response);

            case CheckoutStatusDetailConst::CC_REJECTED_CALL_FOR_AUTHORIZE:
            case CheckoutStatusDetailConst::CC_REJECTED_CARD_DISABLED:
                throw new CheckoutCardException(1151, $this->response);

            case CheckoutStatusDetailConst::CC_REJECTED_INSUFFICIENT_AMOUNT:
                throw new CheckoutCardException(1152, $this->response);

            case CheckoutStatusDetailConst::CC_REJECTED_HIGH_RISK:
            case CheckoutStatusDetailConst::CC_REJECTED_BLACKLIST:
            case CheckoutStatusDetailConst::CC_REJECTED_CARD_ERROR:
                throw new CheckoutCardException(1156, $this->response);

            case CheckoutStatusDetailConst::CC_REJECTED_MAX_ATTEMPTS:
                throw new CheckoutCardException(1159, $this->response);

            case CheckoutStatusDetailConst::CC_REJECTED_INVALID_INSTALLMENTS:
                throw new CheckoutCardException(1158, $this->response);

            default:
                throw new CheckoutCardException(1150, $this->response);
        }
    }
}