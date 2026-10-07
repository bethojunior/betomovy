<?php

namespace app\validator;

use app\validator\contracts\Validator;
use Exception;

class AcquirerValidator extends Validator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public static function validate($request)
    {
        self::isValidPaymentForm($request->payment_form_id);

        self::isNumber($request->payment_form_id);

        return true;
    }

    /**
     * Valida se o payment_form_id é 1 ou 4
     * @param $paymentFormId
     * @throws Exception
     */
    private static function isValidPaymentForm($paymentFormId)
    {
        $validForms = [1, 4];
        
        if (empty($paymentFormId)) {
            throw new Exception("O payment_form_id é obrigatório.");
        }

        if (!in_array((int)$paymentFormId, $validForms)) {
            throw new Exception("O payment_form_id deve ser 1 (Cartão) ou 4 (PIX).");
        }
    }
}