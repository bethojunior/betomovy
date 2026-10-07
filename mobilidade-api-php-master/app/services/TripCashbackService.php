<?php

namespace app\services;

use app\constant\CustomerBalanceConst;
use app\dao\BalanceDao;
use app\dao\BalanceFlowDao;
use app\dao\CashbackDao;
use app\dao\TripCashbackDao;
use app\dao\UserDao;
use app\model\Cashback;
use Exception;
use app\model\Trip;
use app\model\TripCashback;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/12/2019
 * Time: 15:47
 */
class TripCashbackService
{
    private $dao;
    private $userDao;
    private $cashbackDao;
    private $balanceDao;
    private $balanceFlowDao;

    public function __construct()
    {
        $this->dao = new TripCashbackDao;
        $this->cashbackDao = new CashbackDao;
        $this->userDao = new UserDao;
        $this->balanceDao = new BalanceDao;
        $this->balanceFlowDao = new BalanceFlowDao;
    }

    /**
     * @param Trip $trip
     * @return bool|null
     * @throws Exception
     */
    public function payCashback(Trip $trip)
    {
        $tripCashback = $this->dao
            ->findByTrip($trip->getTripReference());

        if (!$tripCashback)
            return null;

        $tripCashback = new TripCashback($tripCashback);
        $cashback = $this->cashbackDao
            ->find($tripCashback->getCashbackId());

        $userWithBalance = $this->userDao
            ->findWithBalance($tripCashback->getUserId());

        $this->addBalance($userWithBalance->balanceId, $tripCashback, new Cashback($cashback));

        return true;
    }

    /**
     * @param $balanceId
     * @param TripCashback $tripCashback
     * @param \app\model\Cashback $cashback
     * @return bool
     * @throws Exception
     */
    private function addBalance($balanceId, TripCashback $tripCashback, Cashback $cashback)
    {
        $property = "balance";
        $type = CustomerBalanceConst::BALANCE_CASHBACK;

        if ((bool)$cashback->getBackToTripBalance()) {
            $property = "tripBalance";
            $type = CustomerBalanceConst::VOUCHER_CASHBACK;
        }

        $this->balanceDao
            ->update($balanceId, (float)$tripCashback->getValue(), [$property]);

        $this->balanceFlowDao->insert(
            (float)$tripCashback->getValue(),
            $type,
            $balanceId,
            $tripCashback->getTripReference());

        return true;
    }
}