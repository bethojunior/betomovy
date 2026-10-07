<?php

namespace app\commands;

use app\constant\DriverBalanceConst;
use app\dao\BalanceFlowDao;
use app\dao\DriverBalanceDao;
use app\services\BalanceAdjustmentDao;
use app\utils\Command;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/03/2019
 * Time: 17:48
 */
class BalanceAdjustmentCommand extends Command
{
    private $dao;
    private $balanceFlowDao;
    private $driverBalanceDao;

    public function __construct($params = null)
    {
        parent::__construct($params);

        $this->dao = new BalanceAdjustmentDao;
        $this->balanceFlowDao = new BalanceFlowDao;
        $this->driverBalanceDao = new DriverBalanceDao;
    }

    public function handle(): void
    {
        $drivers = $this->dao->getDrivers();

        $balances = array_map(function ($driver) {
            $value = abs($driver->balance);

            $this->balanceFlowDao
                ->insert(
                    $value,
                    DriverBalanceConst::BONUS_DRIVER_VIP,
                    $driver->balanceId
                );

            $this->driverBalanceDao
                ->add($driver->balanceId, $value);

            return $value;
        }, $drivers);

        $this->response = json_encode($balances);
    }
}