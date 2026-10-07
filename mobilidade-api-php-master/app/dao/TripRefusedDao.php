<?php

namespace app\dao;

use app\utils\BaseDao;

class TripRefusedDao extends BaseDao
{
    protected $table = "tripRefused";

    public function find(int $id) {
        $select = ["id", "driverId", "tripId", 'created_at'];
        $where = [["id", "=", $id]];

        return $this->sqlSelect($select, $where, [], 1)->get(false);
    }

    public function delete(int $id) {
        $where = [["id", "=", $id]];

        return $this->sqlDelete($where);
    }

    public function deleteByTripId(int $tripId) {
         if (!isset($tripId) || $tripId <= 0) return false;

        $where = [["tripId", "=", $tripId]];

        return $this->sqlDelete($where);
    }
}
