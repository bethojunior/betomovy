<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\QueueFinishedTrip;

class QueueFinishedTripDao extends BaseDao
{
    protected $primaryKey = 'id';
    protected $table = 'queueFinishedTrip';

    public function getAll()
    {
        $query = "SELECT * FROM queueFinishedTrip";

        return $this->sqlRawSelect($query)->get(false);
    }

    public function newTrip(QueueFinishedTrip $queueFinishedTrip)
    {
        return $this->sqlInsert($queueFinishedTrip);
    }

    public function turnOffTrip(string $ids)
    {
        $query = "UPDATE queueFinishedTrip SET used = 1 WHERE id IN ({$ids})";

        return $this->sqlRawUpdate($query);
    }

    public function getIdsWithLimit(int $idUser, int $limit)
    {
        $query = "SELECT
                    id
                FROM
                    queueFinishedTrip
                WHERE
                    idUser = :idUser
                    AND 
                    used = 0
                ORDER BY
                    idTrip
                LIMIT {$limit}
        ";

        $ids = $this->sqlRawSelect($query, [':idUser' => $idUser])->get();

        $idsMapped = array_map(function ($item) {
            return $item->id;
        }, $ids);

        return $idsMapped;
    }

    public function avgTripCalculation(int $idUser, int $limit)
    {
        $ids = implode(",", $this->getIdsWithLimit($idUser, $limit));

        $turnOffUsedTrips = $this->turnOffTrip($ids);

        if (!$turnOffUsedTrips) {
            return false;
        }

        $query = "SELECT avg(price) AS 'tripAvg' FROM queueFinishedTrip WHERE id IN ({$ids})";

        $result = $this->sqlRawSelect($query)->get(false);

        return $result;
    }

    public function getAllUserTrips(int $idUser)
    {
        $query = /** @lang sql */
            "SELECT COUNT(id) AS quantity FROM queueFinishedTrip WHERE idUser = :idUser AND used = 0";

        return $this->sqlRawSelect($query, [':idUser' => $idUser])->get(false);
    }

    public function useAllUserSaleTrips(int $idUser): bool
    {
        $query =  /** @lang sql */
            "UPDATE queueFinishedTrip SET used = 1 WHERE idUser = :idUser AND used = 0";

        return $this->sqlRawUpdate($query, [':idUser' => $idUser], false);
    }
}