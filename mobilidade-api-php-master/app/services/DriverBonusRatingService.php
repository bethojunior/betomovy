<?php

namespace app\services;

use app\constant\UserBonusRatingConst;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/01/2019
 * Time: 17:51
 */
class DriverBonusRatingService
{
    private $userBonusRatingService;

    public function __construct()
    {
        $this->userBonusRatingService = new UserBonusRatingService;
    }

    /**
     * @throws Exception
     */
    public function insertByAccept()
    {
        $this->userBonusRatingService
            ->insert(UserBonusRatingConst::TRIP_ACCEPTED);
    }
}