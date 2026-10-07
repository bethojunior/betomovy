<?php

namespace app\validator;
use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/09/2018
 * Time: 12:01
 */
class BalanceFlowValidator
{
    const MAX_FILTER_DAYS = 90;

    /**
     * @param $date_interval
     * @return bool
     * @throws Exception
     */
    public function validateDateIntervalDriverTransactions($date_interval)
    {
        if (!isset($date_interval->date_start) || !isset($date_interval->date_end))
            throw new Exception("Intervalo de datas esta no formato inválido");

        if (diffInDays($date_interval->date_start, $date_interval->date_end) > self::MAX_FILTER_DAYS)
            throw new Exception("Intervalo de tempo ultrapassa o limite permitido");

        return true;
    }

    /**
     * @param $date_interval
     * @return bool
     * @throws Exception
     */
    public function validateDateIntervalPartnerTransactions($date_interval)
    {
        if (!isset($date_interval->date_start) || !isset($date_interval->date_end))
            throw new Exception("Intervalo de datas esta no formato inválido");

        if (diffInDays($date_interval->date_start, $date_interval->date_end) > self::MAX_FILTER_DAYS)
            throw new Exception("Intervalo de tempo ultrapassa o limite permitido");

        return true;
    }
}