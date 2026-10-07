<?php

namespace app\commands;

use app\services\BlockedTripService;
use app\utils\Command;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/05/2019
 * Time: 15:25
 */
class ReleaseBlockedTripsCommand extends Command
{
    private $service;

    public function __construct($params = null)
    {
        $this->logCommand = true;

        $this->response = writeLn("########################################");
        $this->response .= writeLn("########### Abrindo conexão ############");

        parent::__construct($params);

        $this->response .= writeLn("########### Conexão  aberta ############");
        $this->response .= writeLn("########################################");

        $this->service = new BlockedTripService;
    }

    public function handle(): void
    {
        $this->response .= writeLn("##### Buscando viagens bloqueadas ######");

        $blockedTrips = $this->service
            ->findBlockedTrips();

        $this->response .= writeLn("########### " . count($blockedTrips) . " encontrada(s) ############");

        if (empty($blockedTrips)) {
            $this->response .= writeLn("######### Encerrando operação ##########");
            $this->response .= writeLn("########################################");
            return;
        }

        $this->conn
            ->beginTransaction();

        try {
            array_walk($blockedTrips, function ($trip) {
                $this->response .= writeLn("########################################");
                $this->response .= writeLn("###### Buscando Fluxos bloqueados ######");
                $this->response .= writeLn("######### da viagem:  ##################");
                $this->response .= writeLn("# " . $trip->tripReference . " #");

                $blockedBalanceFlows = $this->service
                    ->findBlockedBalanceFlows($trip->tripReference);

                $resultOperations = null;

                $this->response .= writeLn("########### " . count($blockedBalanceFlows) . " encontrada(s) ############");

                array_walk($blockedBalanceFlows, function ($balanceFlow) use ($trip, &$resultOperations) {
                    $this->response .= writeLn("##### Liberando fluxo ID: {$balanceFlow->idBalanceFlow} #########");
                    $result = $this->service
                        ->releaseFlowType($balanceFlow->idBalanceFlow, $trip->tripPaymentFormId);

                    $resultOperations = $result ?? $resultOperations;
                });

                $this->response .= writeLn("########### Saldos Liberados ###########");
                $this->response .= writeLn("########## Atualizando viagem ##########");

                if (!empty($blockedBalanceFlows) && $resultOperations)
                    $this->service
                        ->releaseAuditTrip($trip->tripReference);

                $this->response .= writeLn("########### VIAGEM LIBERADA ############");
                $this->response .= writeLn("########################################");
            });

            $this->response .= writeLn("######### Encerrando operação ##########");
            $this->response .= writeLn("########################################");

            $this->conn
                ->commit();

        } catch (Exception $e) {

            $this->conn
                ->rollBack();

            $this->response .= writeLn("$ ERROR : ");
            $this->response .= writeLn("$ Message - " . $e->getMessage());
        }
    }
}