<?php

namespace app\commands;

use app\constant\DriverBalanceConst;
use app\dao\BalanceFlowDao;
use app\dao\DriverBalanceDao;
use app\dao\TripCancellationCustomerFeeDao;
use app\utils\Command;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/04/2019
 * Time: 19:05
 */
class BillCancellationFeesCommand extends Command
{
    private $dao;
    private $driverBalanceDao;
    private $balanceFlowDao;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->dao = new TripCancellationCustomerFeeDao;
        $this->driverBalanceDao = new DriverBalanceDao;
        $this->balanceFlowDao = new BalanceFlowDao;
        $this->setLogCommand(true);
    }

    /**
     * @throws Exception
     */
    public function handle(): void
    {
        $this->feedResponse("Buscando taxas de cancelamentos");
        $fees = $this->dao->getReleasedFees();

        $this->feedResponse("Busca completa: " . count($fees) . ' encontrado(s)');

        foreach ($fees as $fee) {
            $this->feedResponse("###################################################");
            $this->feedResponse("Adicionando taxa ao saldo do motorista {$fee->name}");
            $this->driverBalanceDao
                ->add($fee->balanceId, $fee->feeValue);

            $this->feedResponse("Taxa de R\${$fee->feeValue} adicionado");

            $this->feedResponse("------------------------------------");
            $this->feedResponse("Inserindo no extrato financeiro");
            $this->balanceFlowDao
                ->insertWithCancellationFee(
                    $fee->feeValue,
                    DriverBalanceConst::BALANCE_IN_CANCELLATION_FEE,
                    $fee->balanceId,
                    $fee->id
                );
            $this->feedResponse("Extrato financeiro alimentado");

            $this->feedResponse("------------------------------------");
            $this->feedResponse("Removendo da lista de cancelamentos pendentes");
            $this->dao
                ->updateScheduledCancellation($fee->id);
            $this->feedResponse("Agendamento de taxa de cancelamento do cliente removido com sucesso!");
            $this->feedResponse("------------------------------------");

            $this->feedResponse("Encerrando transação com o motorista: {$fee->name}");
            $this->feedResponse("###################################################");
            $this->feedResponse("");
        }

        $this->feedResponse(count($fees) . " taxa(s) faturada(s)");

        $this->feedResponse("Até amanhã!");
    }

    private function feedResponse($message)
    {
        if (!$this->response)
            $this->response = "";

        $this->response .= writeLn($message);
    }
}