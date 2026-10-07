<?php

namespace app\services;

use app\dao\DriverDao;
use app\dao\UserDao;
use app\dao\UserIndicationDao;
use app\exceptions\DriverException;
use app\exceptions\UserIndicationException;
use app\validator\UserIndicationValidator;
use Exception;
use stdClass;
use app\model\UserIndication;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2019
 * Time: 18:48
 */
class DriverIndicationService
{
    private $dao;
    private $validator;
    private $driverDao;
    private $userDao;

    public function __construct()
    {
        $this->dao = new UserIndicationDao;
        $this->validator = new UserIndicationValidator;
        $this->driverDao = new DriverDao;
        $this->userDao = new UserDao;
    }

    /**
     * @param $request
     * @return stdClass
     * @throws DriverException
     * @throws UserIndicationException
     * @throws Exception
     */
    public function insert($request)
    {
        $this->validator->validateInsert($request);

        $driver = $this->driverDao
            ->find($request->driverId, false);

        if (!$driver)
            throw new DriverException(502);

        $userAlreadyIndicated = $this->dao
            ->findIndicated($driver->userId);

        if ($userAlreadyIndicated)
            throw new UserIndicationException(1520);

        $whoIndicatedId = (int)base64_decode($request->whoIndicatedId);

        if (!$whoIndicatedId || !is_int($whoIndicatedId))
            throw new UserIndicationException(1521);

        $userWhoIndicated = $this->userDao
            ->find($whoIndicatedId);

        if (!$userWhoIndicated)
            throw new UserIndicationException(1521);

        $indication = new UserIndication;
        $indication
            ->setUserIndicatedId($driver->userId)
            ->setWhoIndicatedId($userWhoIndicated->idUser)
            ->setId(
                $this->dao
                    ->sqlInsert($indication)
            );

        return $indication->toStdClass();
    }
}