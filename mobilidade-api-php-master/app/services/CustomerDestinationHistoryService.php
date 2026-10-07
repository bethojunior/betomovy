<?php

namespace app\services;

use app\dao\CustomerDestinationHistoryDao;
use app\utils\Headers;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/01/2019
 * Time: 15:20
 */
class CustomerDestinationHistoryService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new CustomerDestinationHistoryDao;
    }

    public function getHistorical()
    {
        $userId = Headers::getUserId();

        return $this->dao
            ->find($userId);
    }
}