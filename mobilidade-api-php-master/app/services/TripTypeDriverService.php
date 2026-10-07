<?php

namespace app\services;
use app\dao\TripTypeDriverDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/02/2019
 * Time: 15:41
 */
class TripTypeDriverService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new TripTypeDriverDao;
    }

    public function findDriverTypes($tripTypeId)
    {
        return $this->dao->findDriverTypes($tripTypeId);
    }
}