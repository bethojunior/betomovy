<?php

namespace app\services;

use app\constant\RatingConst;
use app\dao\UserBonusRatingDao;
use app\dao\UserBonusRatingTypeDao;
use app\utils\Headers;
use Exception;
use app\model\UserBonusRating;
use app\model\UserBonusRatingType;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/01/2019
 * Time: 17:04
 */
class UserBonusRatingService
{
    private $dao;
    private $userBonusRatingTypeDao;
    private $userRatingService;

    public function __construct()
    {
        $this->dao = new UserBonusRatingDao;
        $this->userBonusRatingTypeDao = new UserBonusRatingTypeDao;
        $this->userRatingService = new UserRatingService;
    }

    /**
     * Caso o userId for nulo ele irá puxar o userId
     * do header da requisição
     * @param $userPenaltyTypeId
     * @param null $userId
     * @return UserBonusRating
     * @throws Exception
     */
    public function insert($userPenaltyTypeId, $userId = null): UserBonusRating
    {
        $userId = $userId ?? Headers::getUserId();

        $bonusRating = new UserBonusRating;
        $bonusRating
            ->setUserBonusRatingTypeId($userPenaltyTypeId)
            ->setUserId($userId)
            ->setIdUserBonusRating(
                $this->dao
                    ->sqlInsert($bonusRating)
            );

        /**
         * Aplica o bônus (a depender do tipo de bonus)
         * na avaliação do usuário
         */
        $this->updateRatingUser($userId, $userPenaltyTypeId);

        return $bonusRating;
    }

    /**
     * @param $userId
     * @param $userBonusRatingTypeId
     * @return bool
     * @throws Exception
     */
    public function updateRatingUser($userId, $userBonusRatingTypeId)
    {
        $userBonusRatingType = new UserBonusRatingType($this->userBonusRatingTypeDao
            ->find($userBonusRatingTypeId));

        $rating = $this->userRatingService
            ->get($userId);

        return $this->userRatingService
            ->update($userId, $this->calculateRating($rating, $userBonusRatingType->getValueRating()));
    }

    /**
     * @param $actualRating
     * @param $ratingToSum
     * @return float
     */
    private function calculateRating($actualRating, $ratingToSum): float
    {
        $rating = $actualRating + $ratingToSum;

        return $rating > RatingConst::MAX_USER_RATING ?
            RatingConst::MAX_USER_RATING :
            $rating;
    }
}