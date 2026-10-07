<?php

namespace app\services;

use app\dao\ManagerBillingDao;
use app\dao\ManagerDao;
use app\dao\UserIndicationDao;
use app\exceptions\ManagerException;
use app\exceptions\RequestValidatorException;
use app\validator\ManagerValidator;
use Carbon\Carbon;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/06/2019
 * Time: 15:34
 */
class ManagerService
{
    private $userIndicationDao;
    private $validator;
    private $dao;
    private $billingDao;

    public function __construct()
    {
        $this->dao = new ManagerDao;
        $this->userIndicationDao = new UserIndicationDao;
        $this->validator = new ManagerValidator;
        $this->billingDao = new ManagerBillingDao;
    }

    /**
     * @param $userId
     * @param null $request
     * @return array
     * @throws RequestValidatorException
     */
    public function getIndicated($userId, $request = null)
    {
        if (!$userId)
            throw new RequestValidatorException(1101);

        return $this->userIndicationDao
            ->getIndicatedUsersByWhoIndicated($userId, $request->cityId ?? null);
    }

    /**
     * @param $request
     * @param $userId
     * @return array
     * @throws Exception
     */
    public function billing($request, $userId)
    {
        $this->validator
            ->validateQueryBilling($request);

        if (isset($request['date'])) {
            $dates = explode(',', $request['date']);
            $request['date'] = array(
                Carbon::parse($dates[0])->startOfDay(),
                Carbon::parse($dates[1])->endOfDay()
            );
        }

        $trips = $this->billingDao
            ->getTripsBilling($request, $userId);

        $billingCommissions = $this->billingDao
            ->getCommissionsBilling($request, $userId);

        return compact(
            'trips', 'billingCommissions');
    }

    /**
     * @param $userId
     * @return array|mixed
     * @throws RequestValidatorException
     */
    public function citiesWithBilling($userId)
    {
        if (!$userId)
            throw new RequestValidatorException(1101);

        return $this->billingDao
            ->getCitiesWithBilling($userId);
    }

    /**
     * @param $userId
     * @return mixed
     * @throws RequestValidatorException
     */
    public function driversWithBilling($userId)
    {
        if (!$userId)
            throw new RequestValidatorException(1101);

        return $this->billingDao
            ->getDriversWithBilling($userId);
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws Exception
     */
    public function login($request)
    {
        $this->validator
            ->validateLogin($request);

        $user = $this->dao
            ->authenticate($request->email, base64_encode($request->password));

        if (!$user)
            throw new ManagerException(1530);

        $user->api_token = password_hash($user->api_token, PASSWORD_BCRYPT);

        return $user;
    }
}