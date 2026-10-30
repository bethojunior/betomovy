<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/01/2019
 * Time: 15:49
 */

namespace app\commands;

use app\constant\DriverCalledConst;
use app\dao\CustomerDao;
use app\dao\DriverDao;
use app\dao\LogDao;
use app\dao\TripDao;
use app\dao\TripHistoryDao;
use app\dao\TripTypeDao;
use app\dtos\TripCallPushDTO;
use app\model\Config;
use app\model\Driver;
use app\model\DriverCalled;
use app\model\Trip;
use app\realtime\TripRealtime;
use app\services\DriverCalledService;
use app\services\DriverPenaltyService;
use app\services\TripDriversService;
use app\utils\Command;
use Exception;

/**
 * Class TripCallDriverCommand
 * Chama os motoristas próximos que estão registrados em driversCalled
 *
 * Comando: trip-call
 */
class TripCallDriverCommand extends Command
{
    private const LOOPING_MAX_RENEW_LIST = 20;
    private const LOOPING_MAX_RENEW_ALL_DRIVERS_LIST = 1000;

    private $service;
    private $driverCalledService;
    private $driverDao;
    private $tripTypeDao;
    private $driverPenaltyService;
    private $timeToExpireDriverCall;
    private $timeToPassDriverCall;
    private $notAnsweredLimit;
    private $maxRenewList;
    private $maxRenewAllDriversList;
    private $tripRealtime;
    private $fastFingerCall;
    private TripHistoryDao $tripHistoryDao;

    /**
     * TripCallDriverCommand constructor.
     * @param null $params
     * @throws Exception
     */
    public function __construct($params = null)
    {
        parent::__construct($params);

        $this->service = new TripDriversService;
        $this->driverCalledService = new DriverCalledService;
        $this->driverPenaltyService = new DriverPenaltyService;
        $this->driverDao = new DriverDao;
        $this->tripTypeDao = new TripTypeDao;
        $this->tripRealtime = new TripRealtime;
        $this->tripHistoryDao = new TripHistoryDao;
    }

    private function startConfigs()
    {
        $this->timeToExpireDriverCall = (int)Config::get('time_in_seconds_to_call_driver');

        $this->timeToPassDriverCall = (int)Config::get('time_in_seconds_to_pass_driver_call');

        $this->notAnsweredLimit = (int)Config::get('not_answered_limit_to_turn_off_driver');

        $this->maxRenewList = (int)Config::get('max_renew_list');

        $this->maxRenewAllDriversList = (int)Config::get('max_renew_all_drivers_list');

        $this->fastFingerCall = (bool)Config::get('fast_finger_call');
    }

    /**
     * @throws Exception
     */
    public function handle(): void
    {
        set_time_limit(0);
        try {
            $this->startConfigs();

            $tripReference = $this->params[2] ?? '';

            //            $trip = $this->service
            //                ->findTripToCallDrivers();
            //
            //            if (!$trip) {
            //                $this->response = [];
            //                exit;
            //            }

            //            $this->service
            //                ->updateTripToStartCall($trip->tripReference);

            $this->callDrivers($tripReference);

            $this->response = "\n Chamou todos";
        } catch (Exception $e) {
            (new LogDao)->logException($e);
        }
    }

    /**
     * @param $tripReference
     * @throws Exception
     */
    private function callDrivers($tripReference)
    {
        $drivers = $this->driverCalledService
            ->getAllByTrip($tripReference);

        $tripCheck = $this->verifyTripIsSearching($tripReference);
        if ($tripCheck) {
            $this->applyLoopingOption($tripCheck);
        }

        $countRenews = 0;

        while (!empty($drivers) && $countRenews <= $this->maxRenewList) {

            if (!$this->fastFingerCall) {
                echo "[Chamado individual] Executando chamado individual" . PHP_EOL;

                foreach ($drivers as $key => $driver) {

                    echo "[Chamado individual] Buscando informações da viagem" . PHP_EOL;
                    $trip = $this->verifyTripIsSearching($tripReference);
                    if (!$trip) {
                        echo "[Chamado individual] Viagem não esta mais disponível" . PHP_EOL;
                        exit;
                    }

                    echo "[Chamado individual] Verificando status atual do motorista: {$driver->driverId}" . PHP_EOL;
                    $currentDriver = $this->driverDao->findSimple($driver->driverId, ['status']);
                    if (!$currentDriver || $currentDriver->status == Driver::OFF) {
                        echo "[Chamado individual] Motorista {$driver->driverId} está desligado, pulando chamado" . PHP_EOL;
                        continue;
                    }

                    echo "[Chamado individual] Atualizando status CALLING da viagem e do motorista: {$driver->driverId}" . PHP_EOL;
                    $this->updateStatusOnCallTrip($tripReference, $driver->id, $driver->driverId);
                    $trip->callingDriver = (string)$driver->driverId;

                    echo "[Chamado individual] Registrando histórico de chamado" . PHP_EOL;
                    $this->tripHistoryDao->insertTripsFound([$trip], $driver->driverId);

                    echo "[Chamado individual] Atualizando viagem no firebase" . PHP_EOL;
                    $this->tripRealtime
                        ->hydrate($trip)
                        ->createTrip();

                    echo "[Chamado individual] Enviando push notification" . PHP_EOL;
                    $this->notify($key, $drivers, $trip);

                    echo "[Chamado individual] Iniciando espera para o motorista atender o chamado" . PHP_EOL;
                    $this->waitDriverAnswer($tripReference, $driver->id);

                    echo "[Chamado individual] Aguardando tempo para chamar outro motorista" . PHP_EOL;
                    /** tempo para chamar outro motorista */
                    sleep($this->timeToPassDriverCall);

                    if ($this->checkStatusDriver($tripReference, $driver->id)) {
                        echo "[Chamado individual] Motorista atendeu ou recusou a viagem, iniciando verificação da chamada" . PHP_EOL;
                        continue;
                    }


                    echo "[Chamado individual] Atualizando status de chamado do motorista para não atendido" . PHP_EOL;
                    $this->updateStatusOnNotAnsweredTrip($tripReference, new DriverCalled($driver));
                }
            }

            echo "[Chamado individual] Incrementando contador de renovações" . PHP_EOL;
            $countRenews++;

            echo "[Chamado individual] Buscando informações da viagem" . PHP_EOL;
            $trip = $this->verifyTripIsSearching($tripReference);

            if ($trip && $countRenews > $this->maxRenewList) {
                echo "[Chamado individual] A viagem continua disponível e a quantidade de renovações da lista individual chegou ao limite" . PHP_EOL;
                echo "[Chamado individual] Aguardando intervalo antes de iniciar o dedo rápido" . PHP_EOL;
                sleep(5);
                echo "[Chamado individual] Iniciando chamado de dedo rápido" . PHP_EOL;
                $this->callAllDriversClose(new Trip($trip));
            }

            if ($countRenews <= $this->maxRenewList) {
                echo "[Chamado individual] Remontando lista de chamado individual" . PHP_EOL;
                $drivers = $trip ?
                    $this->driverCalledService
                    ->renewList(new Trip($trip)) : [];
            }

            if (!empty($drivers))
                echo "[Chamado individual] Lista renovada" . PHP_EOL;
        }

        sleep(5);

        echo "Finalizando processo de chamado" . PHP_EOL;

        $trip = $this->verifyTripIsSearching($tripReference);

        if ($trip) {
            echo "Viagem ainda disponível e nenhum motorista atendeu. A viagem será expirada!" . PHP_EOL;
            $this->expireTrip(new Trip($trip));
        }
    }

    /**
     * @param Trip $trip
     * @throws Exception
     */
    private function callAllDriversClose(Trip $trip)
    {
        echo "[Dedo rápido] Preparando lista de chamados com raio maior" . PHP_EOL;
        $drivers = $this->driverCalledService
            ->renewListAllDrivers($trip);

        $vehicleCategory = $this->tripTypeDao->find($trip->getTripTypeId())->type ?? null;

        $countRenews = 0;

        echo "[Dedo rápido] Verificando se a viagem ainda está ativa" . PHP_EOL;
        $checkTrip = $this->verifyTripIsSearching($trip->getTripReference());

        while (($this->maxRenewAllDriversList > 50 || !empty($drivers)) && $countRenews <= $this->maxRenewAllDriversList) {

            if (empty($drivers)) {
                $drivers = $this->waitForAvailableDrivers($trip, $countRenews);

                if (empty($drivers)) {
                    if (!$this->verifyTripIsSearching($trip->getTripReference())) {
                        echo "[Dedo rápido] Viagem não está mais ativa [verifyTripIsSearching returned false]. Encerrando." . PHP_EOL;
                        break;
                    }
                }

                $countRenews++;
                continue;
            }

            $driverCalledIdsForCalling = array_map(function ($driver) {
                return $driver->id;
            }, $drivers);
            echo "[Dedo rápido] Atualizando status dos motoristas para CALLING (para aparecer no app)" . PHP_EOL;
            $this->driverCalledService
                ->updateManyStatusById($driverCalledIdsForCalling, DriverCalledConst::CALLING, $trip->getTripReference());

            $driversId = array_map(function ($driver) {
                return $driver->driverId ?? $driver->idDriver ?? null;
            }, $drivers);
            $driversId = array_values(array_filter($driversId));

            echo "[Dedo rápido] Registrando histórico de chamado do lote" . PHP_EOL;
            foreach ($driversId as $driverIdForHistory) {
                $this->tripHistoryDao->insertTripsFound([$trip], $driverIdForHistory);
            }

            echo "[Dedo rápido] Atualizando trip no MYSQL" . PHP_EOL;
            $this->service
                ->updateCallingDriverTrip($trip->getTripReference(), implode(',', $driversId));

            if ($checkTrip) {
                echo "[Dedo rápido] Enviando novos dados da trip para o firebase" . PHP_EOL;
                $checkTrip->callingDriver = implode(',', $driversId);
                $checkTrip->rand = rand();
                $this->tripRealtime
                    ->hydrate($checkTrip)
                    ->createTrip();
            }

            $driversWithToken = array_values(array_filter($drivers, function ($driver) {
                return !empty($driver->deviceToken ?? $driver->device_token ?? null);
            }));

            echo "[Dedo rápido] Enviando notificações push para " . count($driversWithToken) . " motorista(s)" . PHP_EOL;
            if (count($driversWithToken) === 0) {
                echo "[Dedo rápido] AVISO: Nenhum deviceToken válido na lista - push não será enviado" . PHP_EOL;
            }
            $driverModel = new Driver;
            foreach ($driversWithToken as $driver) {
                $deviceToken = $driver->deviceToken ?? $driver->device_token;
                $proximityKm = isset($driver->proximity) ? (float)$driver->proximity : null;
                $driverModel->sendTripNotifications(
                    [$deviceToken],
                    new TripCallPushDTO(
                        $trip->getPrice(),
                        $vehicleCategory,
                        $proximityKm,
                        $trip->getTripReference(),
                        $trip->getUserId(),
                        $trip->getTripCallTypeId()
                    )
                );
            }

            echo "[Dedo rápido] Aguardando o tempo para os motoristas atenderem" . PHP_EOL;
            $this->waitAllDriversAnswer($trip->getTripReference());

            echo "[Dedo rápido] Verificando se a viagem ainda está ativa" . PHP_EOL;
            $checkTrip = $this->verifyTripIsSearching($trip->getTripReference());

            $driverCalledIds = array_map(function ($driver) {
                return $driver->id;
            }, $drivers);

            if ($checkTrip) {
                echo "[Dedo rápido] Atualizando viagens e motoristas para não atendida" . PHP_EOL;
                $this->updateAllDriversStatusOnNotAnsweredTrip($driverCalledIds, $trip->getTripReference());
            } else {
                echo "[Dedo rápido] Viagem não está mais ativa após waitAllDriversAnswer. Encerrando." . PHP_EOL;
            }

            echo "[Dedo rápido] Renovando a lista de motoristas" . PHP_EOL;
            $drivers = $checkTrip ?
                $this->driverCalledService
                ->renewListAllDrivers(new Trip($checkTrip)) : [];

            if (!empty($drivers)) {
                echo "[Dedo rápido] Aguardando intervalo antes do próximo lote de dedo rápido" . PHP_EOL;
                sleep(5);
            }

            /**
             * Só limpa o callingDriver no realtime se NÃO tiver próximo lote pra chamar já.
             * Se tiver, o próximo "CALLING setado" (topo do while) já dispara um realtime novo
             * -- mandar o clear aqui geraria 2 escritas quase simultâneas no mesmo documento,
             * o que faz o listener do app (Firestore/socket) perder/colapsar uma delas.
             */
            if ($checkTrip && empty($drivers)) {
                echo "[Dedo rápido] Ninguém disponível pra próxima rodada, limpando callingDriver no realtime" . PHP_EOL;
                $checkTrip->callingDriver = null;
                $checkTrip->rand = rand();
                $this->tripRealtime
                    ->hydrate($checkTrip)
                    ->setCallingAt(now())
                    ->createTrip();
            }

            $countRenews++;
        }
    }

    /**
     * Aguarda e tenta buscar motoristas novamente caso a lista esteja vazia.
     * Retorna a nova lista de motoristas ou array vazio.
     * @param Trip $trip
     * @param int $currentRenewCount
     * @return array
     */
    private function waitForAvailableDrivers(Trip $trip, int $currentRenewCount): array
    {
        echo "[Dedo rápido] Nenhum motorista encontrado nesta rodada (Renovação {$currentRenewCount}). Aguardando 5 segundos..." . PHP_EOL;
        sleep(5);

        echo "[Dedo rápido] (Loop Vazio) Verificando se a viagem ainda está ativa" . PHP_EOL;
        $checkTrip = $this->verifyTripIsSearching($trip->getTripReference());

        if ($checkTrip) {
            echo "[Dedo rápido] (Loop Vazio) Tentando buscar motoristas novamente..." . PHP_EOL;
            return $this->driverCalledService->renewListAllDrivers(new Trip($checkTrip));
        }

        return [];
    }

    /**
     * Atualizando status do motorista chamado
     * e inserindo o motorista que está sendo chamado na trip
     * @param $tripReference
     * @param $driverCalledId
     * @param $driverId
     * @throws Exception
     */
    private function updateStatusOnCallTrip($tripReference, $driverCalledId, $driverId)
    {
        $this->service
            ->updateCallingDriverTrip($tripReference, $driverId);

        $this->driverCalledService
            ->updateStatusById($driverCalledId, DriverCalledConst::CALLING, $tripReference);
    }

    /**
     * Atualiza status do motorista quando ele não atende
     * @param $tripReference
     * @param DriverCalled $driver
     * @throws Exception
     */
    private function updateStatusOnNotAnsweredTrip($tripReference, DriverCalled $driver)
    {
        $this->driverCalledService
            ->updateStatusById($driver->getId(), DriverCalledConst::NOT_ANSWERED, $tripReference);

        $this->penalizeDriver($driver->getDriverId());
    }

    /**
     * Atualiza status do motorista quando ele não atende
     * @param array $driverCalledIds
     * @throws Exception
     */
    private function updateAllDriversStatusOnNotAnsweredTrip(array $driverCalledIds, ?string $tripReference = null)
    {
        $this->driverCalledService
            ->updateManyStatusById($driverCalledIds, DriverCalledConst::NOT_ANSWERED, $tripReference);

        //        $this->penalizeDriver($driver->getDriverId());
    }

    /**
     * Verifica se a viagem ainda está ativa
     * @param $tripReference
     * @return array|bool|mixed
     */
    private function verifyTripIsSearching($tripReference)
    {
        $trip = (new TripDao())->find($tripReference);

        if (!$trip) {
            return false;
        }

        if (!in_array($trip->status, [Trip::SEARCHING, Trip::SEARCHING_FAVORITE], true)) {
            return false;
        }

        return $trip;
    }

    /**
     * @param Trip $trip
     * @throws Exception
     */
    private function expireTrip(Trip $trip)
    {
        (new CustomerDao)
            ->cancelTrip($trip->getTripReference(), now(), $trip->getUserId(), Trip::NOT_ANSWERED);

        $this->tripRealtime
            ->setTripReference($trip->getTripReference())
            ->deleteTrip();
    }

    /**
     * @param $driverId
     * @throws Exception
     */
    private function penalizeDriver($driverId)
    {
        $driver = $this->driverDao
            ->findSimple($driverId);

        //        $this->disableDriverOnLimit(new Driver($driver));

        $this->driverPenaltyService
            ->insertByNotAnswer($driver->userId);
    }

    /**
     * Percorre o tempo de chamada do motorista
     * @param $tripReference
     * @param $driverCalledId
     */
    private function waitDriverAnswer($tripReference, $driverCalledId)
    {
        $timeActual = 1;
        //        $timeToExpireDriverCall = $key === 0 ?
        //            ($this->timeToExpireDriverCall + 15) : $this->timeToExpireDriverCall;

        while ($timeActual < $this->timeToExpireDriverCall) {

            echo "[Chamado individual] Consultando status de atendimento do motorista.. ";
            $driver = $this->driverCalledService
                ->getStatusDriver($tripReference, $driverCalledId);

            echo " Status do motorista encontrado: {$driver->status}. ";
            if ($driver->status <> DriverCalledConst::CALLING)
                break;

            echo "Chamando motorista " . $driver->driverId . " time: " . $timeActual . "\n";

            sleep(1);

            $timeActual++;
        }
    }

    private function waitAllDriversAnswer($tripReference)
    {
        $timeActual = 1;

        while ($timeActual < $this->timeToExpireDriverCall) {

            echo "[Dedo rápido] Consultando status de atendimento dos motoristas.. ";
            $drivers = $this->driverCalledService
                ->getStatusAllDrivers($tripReference);

            $stop = false;

            echo " Motoristas encontrados, verificando se alguém atendeu. ";
            foreach ($drivers as $driver) {
                if ($driver->status == DriverCalledConst::ACCEPTED) {
                    echo " Motorista {$driver->driverId} atendeu. ";
                    $stop = true;
                    break;
                }
            }

            if ($stop)
                break;

            echo " Chamando motoristas. Time: " . $timeActual . "\n";

            sleep(1);

            $timeActual++;
        }
    }

    /**
     * Retorna true se o motorista tiver aceitado uma corrida
     * @param $tripReference
     * @param $driverCalledId
     * @return bool
     */
    private function checkStatusDriver($tripReference, $driverCalledId)
    {
        $driver = $this->driverCalledService
            ->getStatusDriver($tripReference, $driverCalledId);

        if ($driver->status == DriverCalledConst::ACCEPTED ||
            $driver->status == DriverCalledConst::REFUSED)
            return $driver;

        return false;
    }

    /**
     * Notifica o próximo motorista
     * para abrir o app
     * @param $key
     * @param array $drivers
     * @param $trip stdClass da view tripDrivers (com price/type já prontos)
     * @return bool
     */
    private function notify($key, array $drivers, $trip = null)
    {
        $driverModel = new Driver;
        $deviceTokens = array();

        if (!empty($drivers[$key]->deviceToken))
            $deviceTokens[] = $drivers[$key]->deviceToken;

        //        if (isset($drivers[$key + 1]))
        //            $deviceTokens[] = $drivers[$key + 1]->deviceToken;

        $proximityKm = isset($drivers[$key]->proximity) ? (float)$drivers[$key]->proximity : null;

        $driverModel->sendTripNotifications(
            $deviceTokens,
            new TripCallPushDTO(
                isset($trip->price) ? (float)$trip->price : null,
                $trip->type ?? null,
                $proximityKm,
                $trip->tripReference ?? null,
                $trip->userId ?? null,
                $trip->tripCallTypeId ?? null
            )
        );

        return true;
    }

    /**
     * @param Driver $driver
     * @return bool
     * @throws Exception
     */
    private function disableDriverOnLimit(Driver $driver)
    {
        $count = $driver->getCountNotAnswered() + 1;
        $status = $driver->getStatus();
        if ($count == $this->notAnsweredLimit) {
            $count = 0;
            $status = Driver::OFF;
        }

        return $this->driverDao
            ->updateCountNotAnswered($driver->getIdDriver(), $count, $status);
    }

    private function applyLoopingOption($trip)
    {
        if (empty($trip->tripTypeId)) return;

        $tripType = $this->tripTypeDao->findById($trip->tripTypeId);

        if ($tripType && !empty($tripType->loopingOption) && $tripType->loopingOption == 1) {
            echo "[Looping Definido] Viagem com looping infinito ativado. Aumentando limites." . PHP_EOL;
            $this->maxRenewList = self::LOOPING_MAX_RENEW_LIST;
            $this->maxRenewAllDriversList = self::LOOPING_MAX_RENEW_ALL_DRIVERS_LIST;
        }
    }
}
