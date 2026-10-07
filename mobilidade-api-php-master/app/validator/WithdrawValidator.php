<?php

namespace app\validator;

use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/09/2018
 * Time: 11:42
 */
class WithdrawValidator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateNewWithdraw($request)
    {
        $this->driverIdIsValid($request->driverId ?? null);

        $this->valueIsValid($request->value ?? null);

        return true;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validatePartnerNewWithdraw($request)
    {
        $this->customerIdIsValid($request->customerId ?? null);

        $this->valueIsValid($request->value ?? null);

        return true;
    }

    /**
     * @param $driverId
     * @throws Exception
     */
    private function driverIdIsValid($driverId)
    {
        if (empty($driverId))
            throw new Exception("ID do motorista inválido");

        if (!is_int($driverId))
            throw new Exception("ID do motorista deve ser do tipo inteiro");
    }

    /**
     * @param $value
     * @throws Exception
     */
    private function valueIsValid($value)
    {
        if (empty($value))
            throw new Exception("Valor não pode ser vazio");

        if (!is_numeric($value))
            throw new Exception("Valor deve ser do tipo float");

        if ($value <= 0)
            throw new Exception("Valor não pode ser zero");
    }

    /**
     * @param $customerId
     * @throws Exception
     */
    private function customerIdIsValid($customerId)
    {
        if (empty($customerId))
            throw new Exception("ID do parceiro inválido");

        if (!is_int($customerId))
            throw new Exception("ID do parceiro deve ser do tipo inteiro");
    }
}