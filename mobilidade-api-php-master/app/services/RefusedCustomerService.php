<?php

namespace app\services;

use app\dao\FavoriteDriverDao;
use app\dao\LogDao;
use app\dao\RefusedCustomerDao;
use app\exceptions\RefusedCustomerException;
use app\utils\Headers;
use app\validator\RefusedDriverValidator;
use Exception;
use app\model\Log;
use app\model\LogApp;
use app\model\LogCriticalType;
use app\model\LogType;
use app\model\RefusedCustomer;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/03/2019
 * Time: 13:50
 */
class RefusedCustomerService
{
    private $dao;
    private $validator;
    private $favoriteDao;

    public function __construct()
    {
        $this->dao = new RefusedCustomerDao;
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

        $refused = new RefusedCustomer;
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
            $refused->getDriverId(),
            Headers::getUserId(),
            "MOTORISTA RECUSOU RECEBER VIAGENS DE UM PASSAGEIRO"
        );

        return true;
    }

    /**
     * @param $driverId
     * @return array|mixed
     */
    public function list($driverId)
    {
        $refuseds = $this->dao
            ->getAll($driverId);

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
            throw new RefusedCustomerException(1031, ['sended' => $idRefused]);

        return $this->dao
            ->delete($idRefused);
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

        $customers = $this->dao
            ->getAll($request->driverId);

        foreach ($customers as $customer) {
            if ($request->customerId == $customer->idCustomer)
                throw new RefusedCustomerException(1030, compact('customer'));
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
            ->setApp(LogApp::DRIVER)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }
}