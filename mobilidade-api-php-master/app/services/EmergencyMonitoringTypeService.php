<?php

namespace app\services;
use app\dao\EmergencyMonitoringTypeDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/12/2019
 * Time: 15:56
 */
class EmergencyMonitoringTypeService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new EmergencyMonitoringTypeDao;
    }

    public function findAll()
    {
        return $this->dao
            ->findAll();
    }
}