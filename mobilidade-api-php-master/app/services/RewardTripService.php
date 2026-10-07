<?php

namespace app\services;
use app\dao\RewardTripDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/02/2019
 * Time: 10:50
 */
class RewardTripService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new RewardTripDao;
    }

    public function findOne($rewardTripId)
    {
        if (!$rewardTripId)
            return null;

        return $this->dao
            ->findOne($rewardTripId);
    }
}