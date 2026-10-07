<?php

namespace app\services;

use app\dao\DriverDao;
use app\exceptions\DriverException;
use app\model\Config;
use app\model\Driver;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/12/2019
 * Time: 09:47
 */
class DriverDataSheetService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new DriverDao;
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws DriverException
     * @throws Exception
     */
    public function show($request)
    {
        if (!isset($request->driverId))
            throw new DriverException(502);

        $driver = $this->dao
            ->findWithTrip($request->driverId);

        $driver->fullPathImage =
            Config::get('link_storage_pictures') . Driver::PROFILE_DIR . $driver->profileImage;

        return $driver;
    }
}