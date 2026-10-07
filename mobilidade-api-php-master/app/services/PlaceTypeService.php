<?php

namespace app\services;
use app\dao\PlaceTypeDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/01/2019
 * Time: 11:26
 */
class PlaceTypeService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new PlaceTypeDao;
    }

    public function getAll()
    {
        return $this->dao
            ->getAll();
    }
}