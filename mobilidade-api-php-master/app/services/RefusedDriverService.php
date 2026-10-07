<?php

namespace app\services;

use app\dao\FavoriteDriverDao;
use app\dao\LogDao;
use app\dao\RefusedDriverDao;
use app\exceptions\FavoriteDriverException;
use app\exceptions\RefusedDriverException;
use app\utils\Headers;
use app\validator\RefusedDriverValidator;
use Exception;
use app\model\Log;
use app\model\LogApp;
use app\model\LogCriticalType;
use app\model\LogType;
use app\model\RefusedDriver;
use app\dao\CustomerDao;
use app\realtime\TripRealtime;
use app\dao\TripScheduledDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/03/2019
 * Time: 17:34
 */
class RefusedDriverService
{
    private $dao;
    private $validator;
    private $favoriteDao;

    public function __construct()
    {
        $this->dao = new RefusedDriverDao;
        $this->validator = new RefusedDriverValidator;
        $this->favoriteDao = new FavoriteDriverDao;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function insert($request): bool
    {
        $this->validateInsert($request);

        $refused = new RefusedDriver;
        $refused
            ->setCustomerId($request->customerId)
            ->setDriverId($request->driverId)
            ->setId(
                $this->dao
                    ->sqlInsert($refused)
            );

        $this->removeIfFavorite($request->driverId, $request->customerId);

        $this->createLog(
            $refused->toStdClass(),
            $refused->getCustomerId(),
            Headers::getUserId(),
            "CLIENTE RECUSOU RECEBER VIAGENS DE UM MOTORISTA"
        );

        $this->updateBlockedDriversInScheduledTrips($request->customerId);

        return true;
    }

    /**
     * @param $customerId
     * @return array|mixed
     * @throws Exception
     */
    public function list($customerId)
    {
        $refuseds = $this->dao
            ->getAll($customerId);

        return $refuseds;
    }

    /**
     * @param $idRefused
     * @return bool
     * @throws Exception
     */
    public function delete($idRefused)
    {
        if (!is_numeric($idRefused))
            throw new FavoriteDriverException(1026, ['sended' => $idRefused]);

        $refused = $this->dao->findById($idRefused); 
        $result = $this->dao->delete($idRefused);

        // Atualiza o Firestore das viagens agendadas do cliente
        if ($refused && isset($refused->customerId)) {
            $this->updateBlockedDriversInScheduledTrips($refused->customerId);
        }

        return $result;
    }

    /**
     * @param $driverId
     * @param $customerId
     */
    private function removeIfFavorite($driverId, $customerId): void
    {
        $favorites = $this->favoriteDao->getAll($customerId);

        array_walk($favorites, function ($favorite) use ($driverId) {
            if ($driverId == $favorite->idDriver)
                $this->favoriteDao->delete($favorite->idFavorite);
        });
    }

    /**
     * @param $request
     * @throws Exception
     */
    private function validateInsert($request): void
    {
        $this->validator
            ->validateRefusedDriver($request);

        $drivers = $this->dao
            ->getAll($request->customerId);

        foreach ($drivers as $driver) {
            if ($request->driverId == $driver->idDriver)
                throw new RefusedDriverException(1025, compact('driver'));
        }
    }

    /**
     * @param $data
     * @param $idReference
     * @param $userId
     * @param $message
     * @param string $level
     * @return bool
     * @throws Exception
     */
    private function createLog($data, $idReference, $userId, $message, $level = LogCriticalType::INFORMACAO): bool
    {
        $log = new Log(LogType::PROCESS, $level);
        $log->setData($data)
            ->setIdReference($idReference)
            ->setUserId($userId)
            ->setApp(LogApp::CUSTOMER)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }

    public function listDriversBlockedByCustomer($driverId)
    {
        $driversBlocked = $this->dao
            ->getAllDriversBlockedByCustomer($driverId);
    }

    public function findCustomersBlockedMe(int $idDriver)
    {
        return $drivers = $this->dao->getAllCustomersBlockedMe($idDriver);
    }

    /**
     * Atualiza a lista de motoristas bloqueados no Firestore para todas as viagens agendadas do cliente
     * @param $customerId
     */
    private function updateBlockedDriversInScheduledTrips($customerId)
    {
        // Buscar motoristas bloqueados
        $blockedDrivers = (new CustomerDao())->getDriversBlockedByCustomer($customerId) ?? [];

        // Buscar o userId do cliente
        $customerDao = new CustomerDao();
        $customer = $customerDao->sqlSelect(['userId'], [['idCustomer', '=', $customerId]])->get(false);
        
        if (!$customer) return;

        // Buscar viagens agendadas do cliente
        $scheduledTrips = array_filter(
            (new TripScheduledDao())->getAll(),
            fn($trip) => isset($trip->userId) && $trip->userId == $customer->userId
        );

        // Atualiza blockedDrivers no Firestore para cada viagem agendada
        foreach ($scheduledTrips as $trip) {
            if (isset($trip->tripReference)) {
                (new TripRealtime())
                    ->setTripReference($trip->tripReference)
                    ->setBlockedDrivers($blockedDrivers)
                    ->updateTrip(['blockedDrivers' => $blockedDrivers]);
            }
        }
    }
}