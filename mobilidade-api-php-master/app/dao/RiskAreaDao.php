<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\RiskArea;

class RiskAreaDao extends BaseDao
{
    protected $table = 'riskArea';

    private function getHaversineDistanceSQL()
    {
        return "6371 * acos(
            cos(radians(:lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians(:lon)) +
            sin(radians(:lat)) * sin(radians(latitude))
        )";
    }

    public function store($data)
    {
        $riskArea = new RiskArea($data);
        $riskArea->setId(
            $this->sqlInsert($riskArea)
        );

        return $riskArea;
    }

    public function isCoordinateInRiskArea($latitude, $longitude, $radiusKm = 0.5, $cityId = null)
    {
        $haversineSql = $this->getHaversineDistanceSQL();

        $sql = "
            SELECT COUNT(*) as count
            FROM {$this->table}
            WHERE status = 'confirmed' AND ({$haversineSql}) <= COALESCE(radius / 1000.0, :defaultRadius)
        ";

        $bind = [
            ':lat' => $latitude,
            ':lon' => $longitude,
            ':defaultRadius' => $radiusKm
        ];

        if ($cityId !== null) {
            $sql .= " AND cityId = :cityId";
            $bind[':cityId'] = $cityId;
        }

        $result = $this->sqlRawSelect($sql, $bind)->get(false);

        return $result && $result->count > 0;
    }

    public function findNearbyRiskAreas($latitude, $longitude, $radiusKm = 0.5, $cityId = null)
    {
        $haversineSql = $this->getHaversineDistanceSQL();

        $sql = "
            SELECT *, ({$haversineSql}) as distance_km
            FROM {$this->table}
            WHERE status = 'confirmed'
        ";

        $bind = [
            ':lat' => $latitude,
            ':lon' => $longitude,
            ':defaultRadius' => $radiusKm
        ];

        if ($cityId !== null) {
            $sql .= " AND cityId = :cityId";
            $bind[':cityId'] = $cityId;
        }

        $sql .= " HAVING distance_km <= COALESCE(radius / 1000.0, :defaultRadius)";
        $sql .= " ORDER BY distance_km ASC";

        return $this->sqlRawSelect($sql, $bind)->get();
    }
}
