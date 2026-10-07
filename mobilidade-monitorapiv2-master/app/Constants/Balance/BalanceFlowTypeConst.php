<?php
/**
 * Created by PhpStorm.
 * User: taxireturndell
 * Date: 30/10/18
 * Time: 10:08
 */

namespace App\Constants\Balance;


class BalanceFlowTypeConst
{
    const VOUCHER_BONUS  = 20;
    const VOUCHER_BLOCKED = 33;

    /** Customer */
    const RETURN_TRIP_BALANCE_CANCELLATION = 23;

    /** Driver **/
    const BALANCE_BONUS = 34;
    const BALANCE_LEVELING_OUT = 68;
    const BALANCE_LEVELING_ENTRY = 70;
    const BALANCE_OUT_MANUAL = 71;

    const BALANCE_OUT_RATE_PAYMENT_FORM = 43;
    const BALANCE_OUT_RATE_PAYMENT_FORM_BLOCKED = 44;
    const COMMITTEES_EXIT = 8;

    const ENTRY_DYNAMIC_TAX = 91;
    const EXIT_DYNAMIC_TAX = 92;
}
