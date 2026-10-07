<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2019
 * Time: 16:13
 */
class UserRatingDao extends BaseDao
{
    protected $table = "user";

    /**
     * @param $userId
     * @param $rating
     * @return bool
     * @throws Exception
     */
    public function updateRating($userId, $rating)
    {
        return $this->sqlUpdate(
            ['rating' => ':rating'],
            [
                ['idUser', '=', ':idUser']
            ],
            [':idUser' => $userId, ':rating' => $rating]
        );
    }

    public function getRating($userId)
    {
        return $this->sqlSelect(['rating'],
            [
                ['idUser', '=', ':idUser', 'AND'],
                ['statusId', '=', ':statusId']
            ]
        )
            ->bind([':idUser' => $userId, ':statusId' => Status::ATIVO])
            ->get(false);
    }
}