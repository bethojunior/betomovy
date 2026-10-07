<?php

namespace app\services;

use app\constant\AppConst;
use app\dao\AdvertisingDao;
use app\validator\AdvertisingValidator;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/10/2019
 * Time: 10:55
 */
class AdvertisingService
{
    private $dao;
    private $validator;

    public function __construct()
    {
        $this->dao = new AdvertisingDao;
        $this->validator = new AdvertisingValidator;
    }

    /**
     * @param object $request
     * @return array|mixed|null
     * @throws Exception
     */
    public function findByCoordinate(object $request)
    {
        $this->validator->validateGetAds($request);

        $publicity = $this->dao
            ->findByCoordinate($request->lat, $request->lng, true, $request->appId ?? AppConst::CUSTOMER);

        return empty($publicity) ? null : $publicity;
    }

    /**
     * @param object $request
     * @return array
     * @throws Exception
     */
    public function findAllByCoordinate(object $request)
    {
        $this->validator->validateGetAds($request);

        return $this->dao
            ->findAllByCoordinate(
                $request->lat,
                $request->lng,
                $request->appId ?? AppConst::CUSTOMER,
                $request->genderId ?? null,
                $request->advertisingAppSiteId ?? null
            );
    }
}