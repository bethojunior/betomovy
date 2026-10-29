<?php

namespace app\validator;

use app\exceptions\InvalidFieldBankAccountException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/09/2018
 * Time: 16:57
 */
class BankAccountValidator
{
    /**
     * @param $request
     * @return bool
     * @throws InvalidFieldBankAccountException
     */
    public function validateBankAccount($request)
    {
        if (!$request || count(get_object_vars($request)) < 1)
            throw new InvalidFieldBankAccountException("Nenhum dado de conta bancaria foi enviado");

        // bankId/agency/numberAccount agora são opcionais — só validamos o formato se vierem preenchidos
        if (!empty($request->bankId))
            $this->bankIdIsValid($request->bankId);

        if (!empty($request->agency))
            $this->agencyIsValid($request->agency);

        if (!empty($request->numberAccount))
            $this->numberAccountIsValid($request->numberAccount);

        return true;
    }

    /**
     * @param $request
     * @return bool
     * @throws InvalidFieldBankAccountException
     */
    public function validateUpdateBankAccount($request)
    {
        if (!$request || count(get_object_vars($request)) < 1)
            throw new InvalidFieldBankAccountException("Nenhum dado de conta bancaria foi enviado");

        // bankId/agency/numberAccount são opcionais — só validamos o formato se vierem preenchidos
        if (!empty($request->bankId))
            $this->bankIdIsValid($request->bankId);

        if (!empty($request->agency))
            $this->agencyIsValid($request->agency);

        if (!empty($request->numberAccount))
            $this->numberAccountIsValid($request->numberAccount);

        return true;
    }

    /**
     * @param $bankId
     * @throws InvalidFieldBankAccountException
     */
    private function bankIdIsValid($bankId)
    {
        if ($bankId < 1)
            throw new InvalidFieldBankAccountException("ID do banco é inválido", 'bankId');
    }

    /**
     * @param $agency
     * @throws InvalidFieldBankAccountException
     */
    private function agencyIsValid($agency)
    {
        if (strlen($agency) < 1)
            throw new InvalidFieldBankAccountException("Agência é inválida", 'agency');
    }

    /**
     * @param $numberAccount
     * @throws InvalidFieldBankAccountException
     */
    private function numberAccountIsValid($numberAccount)
    {
        if (strlen($numberAccount) < 1)
            throw new InvalidFieldBankAccountException("Número da conta é inválido", 'numberAccount');
    }
}