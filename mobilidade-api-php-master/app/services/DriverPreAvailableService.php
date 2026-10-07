<?php

namespace app\services;

use app\constant\DriverPreAvailableConst;
use app\dao\DriverPreAvailableDao;
use app\utils\Headers;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/02/2019
 * Time: 16:35
 */
class DriverPreAvailableService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new DriverPreAvailableDao;
    }

    /**
     * @param null $userId
     * @return bool
     * @throws Exception
     */
    public function putPreAvailable($userId = null)
    {
        $userId = $userId ?? Headers::getUserId();

        return $this->dao
            ->updatePreAvailable($userId, DriverPreAvailableConst::PRE_AVAILABLE);
    }
}