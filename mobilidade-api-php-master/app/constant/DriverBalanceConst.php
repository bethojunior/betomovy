<?php

namespace app\constant;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/09/2018
 * Time: 11:01.
 */
class DriverBalanceConst
{
    public const WITHDRAW = 6;
    public const BALANCE_ENTRY_BY_TRIP = 9;
    public const BALANCE_ENTRY_BY_TRIP_IN_ANALYSIS = 10;

    public const BALANCE_OUT_COMMISSIONS = 8;
    public const BALANCE_OUT_COMMISSIONS_IN_ANALYSIS = 17;

    public const BALANCE_ENTRY_BY_TRIP_PAYMENT_IN_CAR = 16;
    public const BALANCE_OUT_BY_TRIP_PAYMENT_IN_CAR = 19;

    public const REWARD_TRIP = 41;
    public const REWARD_TRIP_BLOCKED = 46;

    public const BONUS_DRIVER_VIP = 42;

    public const BALANCE_OUT_RATE_PAYMENT_FORM = 43;
    public const BALANCE_OUT_RATE_PAYMENT_FORM_IN_ANALYSIS = 44;

    public const BALANCE_OUT_CANCELLATION_FEE = 48;
    public const BALANCE_OUT_CANCELLATION_FEE_IN_ANALYSIS = 49;
    public const BALANCE_IN_CANCELLATION_FEE = 50;
    public const BALANCE_IN_CANCELLATION_FEE_IN_ANALYSIS = 51;

    public const BALANCE_OUT_PARTNER_COMMISSION = 52;
    public const BALANCE_OUT_PARTNER_COMMISSION_IN_ANALYSIS = 53;

    public const PROMOTIONAL_RELEASE_FEE = 67;

    public const BONUS_MONETIZATION = 72;
    public const BONUS_MONETIZATION_BLOCKED = 73;

    public const CREDIT_PREPAID_PURCHASE = 83;
    public const TRANSFER_RECEIVING = 83;

    public const ENTRY_DYNAMIC_TAX = 91;
    public const EXIT_DYNAMIC_TAX = 92;
    public const BLOCKED_ENTRY_DYNAMIC_TAX = 93;
    public const BLOCKED_EXIT_DYNAMIC_TAX = 94;

    public const BALANCE_OUT_BY_SPLIT_PAYMENT = 98;
    public const BALANCE_IN_FOR_PIX = 99;
    public const BALANCE_IN_FOR_CARD = 101;
}
