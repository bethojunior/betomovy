<?php

namespace app\constant;

class TransactionTypeConst
{
    public const GENERIC = 1;
    public const NEGATIVE_BALANCE = 2;
    public const VOUCHER = 3;
    public const CREDIT_PREPAID = 4;
    public const TRIP = 5;
    public const TRIP_END = 6;
}