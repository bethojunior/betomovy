<?php

namespace app\services;

use app\dao\PerformanceGradeDao;
use app\dao\UserPenaltiesTypeDao;
use app\dao\UserPenaltyDao;
use app\utils\Headers;
use app\model\BlacklistUser;
use Exception;
use app\model\UserPenaltiesType;
use app\model\UserPenalty;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/01/2019
 * Time: 17:52
 */
class UserPenaltyService
{
    private $dao;
    private $blacklistService;
    private $penaltyTypeDao;
    private $performanceGradeDao;
    private $userRatingService;

    public function __construct()
    {
        $this->dao = new UserPenaltyDao;
        $this->penaltyTypeDao = new UserPenaltiesTypeDao;
        $this->userRatingService = new UserRatingService;
        $this->blacklistService = new BlacklistUserService;
        $this->performanceGradeDao = new PerformanceGradeDao;
    }

    /**
     * Caso o userId for nulo ele irá puxar o userId
     * do header da requisição
     * @param $userPenaltyTypeId
     * @param null $userId
     * @return \app\model\UserPenalty
     * @throws Exception
     */
    public function insert($userPenaltyTypeId, $userId = null): UserPenalty
    {
        $userId = $userId ?? Headers::getUserId();

        $penalty = new UserPenalty;
        $penalty
            ->setUserPenaltyTypeId($userPenaltyTypeId)
            ->setUserId($userId)
            ->setIdUserPenalty(
                $this->dao
                    ->sqlInsert($penalty)
            );

        /**
         * Aplica a penalidade (a depender do tipo da penalidade)
         * na avaliação do usuário
         */
        $this->updatePerformanceGrade($userId, $userPenaltyTypeId);

        return $penalty;
    }

    /**
     * @return array|mixed
     */
    public function getAllActives()
    {
        $userPenalties = $this->dao
            ->getActives();

        return $userPenalties;
    }

    public function getPenalties($userId = null)
    {
        $userId = $userId ?? Headers::getUserId();

        return $this->dao
            ->getByUser($userId);
    }

    /**
     * @return BlacklistUser|null
     * @throws Exception
     */
    public function manageUserBlacklist()
    {
        $penalties = $this->getPenalties();

        $blacklist = $this->blacklistService
            ->insertByPenaltiesQuantity($penalties);

//        if ($blacklist)
//            $this->invalidateMany(array_map(function ($penalty) {
//                return $penalty->idUserPenalty;
//            }, $penalties));

        return $blacklist;
    }

    public function updatePerformanceGrade($userId, $userPenaltyTypeId)
    {
        $penaltyType = new UserPenaltiesType($this->penaltyTypeDao
            ->find($userPenaltyTypeId));

        $performanceGrade = $this->performanceGradeDao->getPerformanceGrade($userId);

        $result = $performanceGrade - $penaltyType->getValueRating();

        if ($result < 0)
            return null;

        return $this->performanceGradeDao
            ->updatePerformanceGrade($userId, $result);
    }

    /**
     * @param $userId
     * @param $userPenaltyTypeId
     * @return bool
     * @throws Exception
     */
    public function updateRatingUser($userId, $userPenaltyTypeId)
    {
        $penaltyType = new UserPenaltiesType($this->penaltyTypeDao
            ->find($userPenaltyTypeId));

        $rating = $this->userRatingService
            ->get($userId);

        return $this->userRatingService
            ->update($userId, $rating - $penaltyType->getValueRating());
    }

    /**
     * Parêmetro é um array de IDs das penalidades
     * @param array $penaltiesIds
     * @throws Exception
     */
    public function invalidateMany(array $penaltiesIds): void
    {
        $ids = implode(',', $penaltiesIds);

        $this->dao
            ->removeMany($ids);
    }
}