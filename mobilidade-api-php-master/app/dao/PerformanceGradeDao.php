<?php


namespace app\dao;

use app\utils\BaseDao;
use Exception;

class PerformanceGradeDao extends BaseDao
{
    protected $table = "driver";

    public function getPerformanceGrade($userId)
    {
        $result = $this->sqlRawSelect("
            SELECT idDriver,performanceGrade, userId
                FROM driver
            WHERE userId = :userId",
            [
                ":userId" => $userId
            ]
        )->get(false);

        return $result ? $result->performanceGrade : null;
    }

    public function updatePerformanceGrade($userId, $performanceGrade)
    {
        try {
            return $this->sqlUpdate(
                ['performanceGrade' => $performanceGrade],
                [
                    ['userId', '=', $userId]
                ]
            );
        } catch (Exception $e) {
            dd($e);
        }
    }

}