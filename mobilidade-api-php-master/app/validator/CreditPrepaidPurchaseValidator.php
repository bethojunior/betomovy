<?php

namespace app\validator;

use app\model\PaymentForm;
use app\validator\contracts\Validator;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/05/2020
 * Time: 13:48
 */
class CreditPrepaidPurchaseValidator extends Validator
{
    /**
     * @param array $request
     * @return bool
     * @throws Exception
     */
    public function validatePurchase($request): bool
    {
        $this->requestIsNotEmpty($request);

        $this->isNumber($request->creditPrepaidId ?? null, 'ID do pré-pago não enviado');
        $this->isNumber($request->paymentFormId ?? null, 'Forma de pagamento não enviada');
        
        if($request->paymentFormId === PaymentForm::PIX) {
            return true;
        }

        if (isset($request->cardId))
            $this->isNumber($request->cardId);

        return true;
    }
}