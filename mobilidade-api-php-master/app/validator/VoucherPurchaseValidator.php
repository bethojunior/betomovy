<?php

namespace app\validator;

use app\exceptions\RequestValidatorException;
use app\exceptions\VoucherPurchaseException;

use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/12/2018
 * Time: 17:26
 */
class VoucherPurchaseValidator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateInsertVoucher($request)
    {
        if (!$request || count(get_object_vars($request)) < 1)
            throw new RequestValidatorException(1100);

        $this->amountIsValid($request->amount ?? null);
        $this->paymentFormIdIsValid($request->paymentFormId ?? null);
        $this->valueIsValid($request->value ?? null);

        return true;
    }

    /**
     * @param $amount
     * @throws Exception
     */
    private function amountIsValid($amount)
    {
        if (!$amount || $amount <= 0)
            throw new VoucherPurchaseException(1052);
    }

    /**
     * @param $paymentFormId
     * @throws Exception
     */
    private function paymentFormIdIsValid($paymentFormId)
    {
        if (!$paymentFormId || !is_numeric($paymentFormId))
            throw new VoucherPurchaseException(1053);
    }

    /**
     * @param $value
     * @throws Exception
     */
    private function valueIsValid($value)
    {
        if (!$value || !is_numeric($value))
            throw new VoucherPurchaseException(1054);
    }
}