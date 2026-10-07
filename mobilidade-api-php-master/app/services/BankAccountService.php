<?php

namespace app\services;
use app\model\BankAccount;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/10/2018
 * Time: 14:23
 */
class BankAccountService
{
    /**
     * @param \app\model\BankAccount $bankAccount
     * @return array
     * @throws Exception
     */
    public function mountEditBankAccount(BankAccount $bankAccount)
    {
        $set = [];
        $bind = [];

        $vars = $bankAccount->extract();

        unset($vars['table']);
        unset($vars['primaryKey']);
        unset($vars['date']);

        foreach ($vars as $key => $value) {
            if ($value) {
                if ($key != 'idBankAccount' && $key != 'date')
                    $set[$key] = ":$key";

                if ($key != 'date')
                    $bind[":$key"] = $value;
            }
        }

        if (empty($set))
            throw new Exception("Nenhum dado foi enviado para atualização");

        return ['set' => $set, 'bind' => $bind, 'where' => ['idBankAccount', '=', ':idBankAccount']];
    }
}