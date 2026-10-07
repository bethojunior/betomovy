<?php

namespace app\services;
use app\dao\TripReportTypeDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2019
 * Time: 09:45
 */
class TripReportTypeService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new TripReportTypeDao;
    }

    public function findAll()
    {
        return $this->dao
            ->getAll();
    }
}