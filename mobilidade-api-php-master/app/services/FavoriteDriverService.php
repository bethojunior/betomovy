<?php

namespace app\services;

use app\constant\FavoriteDriverConst;
use app\constant\PushConfigConst;
use app\dao\CustomerDao;
use app\dao\DriverDao;
use app\dao\FavoriteDriverDao;
use app\dao\LogDao;
use app\dao\PushConfigDao;
use app\dao\UserTypeDao;
use app\exceptions\FavoriteDriverException;
use app\utils\Headers;
use app\utils\Pagination;
use app\utils\Push;
use app\validator\FavoriteDriverValidator;
use app\model\Config;
use Exception;
use app\model\FavoriteDriver;
use app\model\Log;
use app\model\LogApp;
use app\model\LogCriticalType;
use app\model\LogType;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/12/2018
 * Time: 18:18
 */
class FavoriteDriverService
{
    private $validator;
    private $dao;
    private $driverDao;
    private $pushConfigDao;

    public function __construct()
    {
        $this->validator = new FavoriteDriverValidator;
        $this->dao = new FavoriteDriverDao;
        $this->driverDao = new DriverDao;
        $this->pushConfigDao = new PushConfigDao;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function insert($request): bool
    {
        if (isset($request->userId)) {
            $driver = $this->driverDao
                ->findByUserId($request->userId, false);

            if (!$driver)
                return false;

            $request->driverId = $driver->idDriver;
        }

        if (!(bool)Config::get('enable_favorite_driver_with_referral_link'))
            return false;

        $this->validateInsert($request);

        $favorite = new FavoriteDriver();
        $favorite
            ->setCustomerId($request->customerId)
            ->setDriverId($request->driverId)
            ->setIdFavorite(
                $this->dao
                    ->sqlInsert($favorite)
            );

        $this->notifyDriver($request->driverId, $request->customerId);

        $this->createLog(
            $favorite->toStdClass(),
            $favorite->getCustomerId(),
            Headers::getUserId(),
            "CLIENTE ADICIONOU UM MOTORISTA FAVORITO"
        );

        return true;
    }

    /**
     * @param $customerId
     * @return array|mixed
     * @throws Exception
     */
    public function list($customerId)
    {
        $favorites = $this->dao
            ->getAll($customerId);

        return $favorites;
    }

    public function listByDriver($driverId, $page = null)
    {
        $count = $this->dao
            ->getAllByDriver($driverId, true)->totalRows;

        $pagination = new Pagination($count, $page);

        $favorites = $this->dao
            ->getAllByDriver($driverId, false, $pagination->getLimit());

        return array_merge(
            ['paginate' => $pagination->getPaginationInfo()],
            compact('favorites')
        );
    }

    /**
     * @param $idFavorite
     * @return bool
     * @throws Exception
     */
    public function delete($idFavorite)
    {
        if (!is_numeric($idFavorite))
            throw new FavoriteDriverException(1004, ['sended' => $idFavorite]);

        return $this->dao
            ->delete($idFavorite);
    }

    /**
     * @param $request
     * @throws Exception
     */
    private function validateInsert($request): void
    {
        $this->validator
            ->validateFavoriteDriver($request);

        $drivers = $this->dao
            ->getAll($request->customerId);

        if (count($drivers) >= FavoriteDriverConst::LIMIT_MAX_FAVORITE_DRIVERS)
            throw new FavoriteDriverException(1003);

        foreach ($drivers as $driver) {
            if ($request->driverId == $driver->idDriver)
                throw new FavoriteDriverException(1005, $driver);
        }
    }

    /**
     * @param $driverId
     * @param $customerId
     * @return mixed
     * @throws Exception
     */
    private function notifyDriver($driverId, $customerId)
    {
        $customerDao = new CustomerDao;

        $driver = $this->driverDao
            ->find($driverId, false, false);

        $driverType = (new UserTypeDao())->find($driver->userTypeId);

        $customer = $customerDao->findWithUser($customerId);

        $config = $this->pushConfigDao
            ->find(PushConfigConst::FAVORITE_DRIVER_ADDED);

        $config->setMessage(
            str_replace(
                '{customerName}',
                $customer->nickname,
                $config->getMessage())
        );

        $config->setMessage(
            str_replace(
                '{driverType}',
                $driverType->name,
                $config->getMessage())
        );

        $push = new Push;
        $push
            ->setDeviceToken($driver->deviceToken)
            ->setTitle($config->getTitle())
            ->setBody($config->getMessage());

        return $push->sendNotification();
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
}