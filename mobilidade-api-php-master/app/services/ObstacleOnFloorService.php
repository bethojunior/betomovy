<?php

namespace app\services;
use app\dao\ObstacleOnFloorDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/07/2019
 * Time: 11:19
 */
class ObstacleOnFloorService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new ObstacleOnFloorDao;
    }

    public function all()
    {
        return $this->dao
            ->getAll();
    }
}