<?php

namespace app\commands;

use app\constant\DriverBalanceConst;
use app\dao\BalanceDao;
use app\dao\BalanceFlowDao;
use app\dao\FeeDevolutionDao;
use app\dao\UserIndicationDao;
use app\model\FeeDevolution;
use app\utils\Command;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/06/2019
 * Time: 16:58
 */
class FeeDevolutionOfDriversIndicatedCommand extends Command
{
    private $userIndicatedDao;
    private $balanceFlowDao;
    private $balanceDao;
    private $feeDevolutionDao;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->userIndicatedDao = new UserIndicationDao;
        $this->balanceFlowDao = new BalanceFlowDao;
        $this->balanceDao = new BalanceDao;
        $this->feeDevolutionDao = new FeeDevolutionDao;
        $this->logCommand = true;
    }

    public function handle(): void
    {
        $this->response = writeLn('Buscando motoristas com promoção de isenção de taxas');

        $drivers = $this->userIndicatedDao
            ->getIndicationsToFeeDevolution();

        foreach ($drivers as $driver) {
            $this->response .= writeLn('#############################################');
            $this->response .= writeLn('Devolvendo taxas do motorista: ' . $driver->idDriver);

            try {
                $this->conn->beginTransaction();

                $this->giveBackFee($driver);

                $this->conn->commit();

                $this->response .= writeLn('Devolução de taxas do motorista ' . $driver->idDriver . ' finalizada');
            } catch (Exception $e) {

                $this->conn->rollBack();

                $this->response .= writeLn('Erro no motorista: ' . $driver->idDriver);
                $this->response .= writeLn($e->getMessage());
                $this->response .= writeLn('#############################################');

                continue;
            }

            $this->response .= writeLn('#############################################');
        }

        $this->response .= writeLn('Fim da devolução');
    }

    /**
     * @param $driver
     * @return null
     * @throws Exception
     */
    private function giveBackFee($driver)
    {
        $flows = $this->balanceFlowDao
            ->getFlowsToGiveBack($driver->balanceId);

        if (!$flows)
            return null;

        $totalValueToGiveBack = 0;

        $this->response .= writeLn('Total do motorista: ' . $totalValueToGiveBack);
        foreach ($flows as $flow) {
            $totalValueToGiveBack += $flow->value;
            $devolution = new FeeDevolution;
            $devolution
                ->setBalanceFlowId($flow->idBalanceFlow)
                ->setId(
                    $this->feeDevolutionDao
                        ->sqlInsert($devolution)
                );
        }

        if ($totalValueToGiveBack <= 0)
            return null;

        $this->balanceFlowDao
            ->insert(
                $totalValueToGiveBack,
                DriverBalanceConst::PROMOTIONAL_RELEASE_FEE,
                $driver->balanceId);

        $this->response .= writeLn('Lançado no extrato');

        $this->balanceDao
            ->update($driver->balanceId, $totalValueToGiveBack);

        $this->response .= writeLn('Saldo atualizado');

        return true;
    }
}