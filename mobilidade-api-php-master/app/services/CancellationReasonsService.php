<?php

namespace app\services;

use app\dao\CancellationReasonsDao;
use app\utils\RedisUtil;

class CancellationReasonsService
{
    public function getActives()
    {
        // cache não está sendo apagado no monitorapiv2 então ele sempre tras desatualizado.
        // O "cancellation_reasons" é o mesmo pro motorista e cliente e pode ocorrer de trazer o errado depois que ele pega do outro.

        // $redis = new RedisUtil;
        // $result = $redis->get("cancellation_reasons");
        // if ($result)
        //     return $result;

        $result = (new CancellationReasonsDao)->getActives();

        // $redis->set("cancellation_reasons", $result);

        return $result;
    }

    public function getCustomerActives()
    {
        // cache não está sendo apagado no monitorapiv2 então ele sempre tras desatualizado.
        // O "cancellation_reasons" é o mesmo pro motorista e cliente e pode ocorrer de trazer o errado depois que ele pega do outro.

        // $redis = new RedisUtil;
        // $result = $redis->get("cancellation_reasons");
        // if ($result)
        //     return $result;

        $result = (new CancellationReasonsDao)->getCustomersActives();

        // $redis->set("cancellation_reasons", $result);

        return $result;
    }

    public function getReports()
    {
        $result = (new CancellationReasonsDao)->getReportsActives();

        return $result;
    }
}