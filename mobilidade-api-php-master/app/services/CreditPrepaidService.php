<?php

namespace app\services;

use app\dao\CityConfigDao;
use app\dao\CreditPrepaidDao;
use app\dao\CreditPrepaidPaymentFormDao;
use app\utils\RedisUtil;
use app\model\Config;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/05/2020
 * Time: 09:29
 */
class CreditPrepaidService
{
    /**
     * @var CreditPrepaidDao
     */
    private $dao;
    /**
     * @var CreditPrepaidPaymentFormDao
     */
    private $creditPrepaidPaymentFormDao;

    public function __construct()
    {
        $this->dao = new CreditPrepaidDao;
        $this->creditPrepaidPaymentFormDao = new CreditPrepaidPaymentFormDao;
    }

    public function findAll($cityId)
    {
        $redis = new RedisUtil;
        // Comentando por esta gerando inconsistência com o monitor. Ao ajustar monitor aqui sera descomentando.
        // $results = $redis->get("list-prepaid");
        // if ($results)
        //     return $results;

        $cityConfig = (new CityConfigDao)->getByCity($cityId);
        $prepaidTypes = $this->resolvePrepaidTypes($cityConfig);

        $cityCreditsPrepaid = $this->dao->findAll($prepaidTypes, $cityId);

        if (!empty($cityCreditsPrepaid)) {
            $creditsPrepaid = $cityCreditsPrepaid;
        } else {
            $creditsPrepaid = $this->dao->findAll($prepaidTypes);
        }

        $results = array_map(function ($creditPrepaid) {
            $creditPrepaid->paymentForms = $this->creditPrepaidPaymentFormDao
                ->findByCreditPrepaid($creditPrepaid->id);

            return $creditPrepaid;
        }, $creditsPrepaid);

        $redis->set("list-prepaid", $results);

        return $results;
    }

    /**
     * @return string[] Os tipos ('value', 'perPeriod') a buscar, conforme cityConfig.prepayPerPeriod:
     * 0 - usa a config global only_prepaid_per_period, 1 - saldo, 2 - período, 3 - ambos.
     */
    private function resolvePrepaidTypes($cityConfig): array
    {
        if ($cityConfig->prepayPerPeriod === "0") {
            $configPrepaidPerPeriod = Config::get('only_prepaid_per_period');

            return [$configPrepaidPerPeriod ? 'perPeriod' : 'value'];
        }

        if ($cityConfig->prepayPerPeriod === "3") {
            return ['value', 'perPeriod'];
        }

        return [$cityConfig->prepayPerPeriod === "2" ? 'perPeriod' : 'value'];
    }
}