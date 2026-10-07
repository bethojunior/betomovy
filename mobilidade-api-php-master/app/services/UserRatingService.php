<?php

namespace app\services;
use app\dao\UserRatingDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2019
 * Time: 16:32
 */
class UserRatingService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new UserRatingDao;
    }

    public function get($userId)
    {
        $userRating = $this->dao
            ->getRating($userId);

        return $userRating ? $userRating->rating : null;
    }

    /**
     * @param $userId
     * @param $rating
     * @return bool
     * @throws Exception
     */
    public function update($userId, $rating)
    {
        return $this->dao
            ->updateRating($userId, $rating);
    }
}