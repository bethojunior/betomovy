<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/09/2019
 * Time: 13:45
 */

namespace App\Constants\Balance;


class BalanceFlowConst
{
    const VOUCHER_BONUS = 20;
    const VOUCHER_USE = 29;
    const VOUCHER_BLOCK = 33;
    const VOUCHER_PURCHASE = 39;

    const DEBIT_INCLUSION = 71;

    const BONUS_MONETIZATION = 72;
    const VOUCHER_EXIT_RUNNING = 76;

    const CREDIT_PREPAID_PURCHASE = 83;
    const VOUCHER_PURCHASE_CENTRAL = 97;

    const VOUCHER_MOVEMENTS = [
        ['id' => self::VOUCHER_PURCHASE, 'text' => 'COMPRA DE VOUCHER'],
        ['id' => self::VOUCHER_USE, 'text' => 'SAÍDA DE SALDO POR CORRIDA'],
        ['id' => self::VOUCHER_BLOCK, 'text' => 'BLOQUEIO BÔNUS EM VOUCHER'],
        ['id' => self::VOUCHER_BONUS, 'text' => 'BÔNUS EM VOUCHER']
    ];

    const VOUCHER_MOVEMENTS_CENTRAL = [
        ['id' => self::VOUCHER_BONUS, 'text' => 'BÔNUS EM VOUCHER - INSERIDO NO MONITOR'],
        ['id' => self::VOUCHER_EXIT_RUNNING, 'text' => 'SAÍDA DE VOUCHER POR CORRIDA']
    ];
}
