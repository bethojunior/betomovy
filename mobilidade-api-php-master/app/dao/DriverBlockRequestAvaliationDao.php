<?php

namespace app\dao;

use app\model\DriverBlockRequestAvaliation;
use app\utils\BaseDao;

class DriverBlockRequestAvaliationDao extends BaseDao
{
  protected $table = "driverBlockRequestAvaliation";

    public function createRequestBlockDriverAvaliation($tripReference, $idDriver)
    {
        $driverblockRequestAvaliation = new DriverBlockRequestAvaliation;
        return $driverblockRequestAvaliation
            ->setTripReference($tripReference)
            ->setIdDriver($idDriver)
            ->setId(
                $this->sqlInsert($driverblockRequestAvaliation)
            );
    }

    public function getRequestBlockDriverAvaliation($idDriver)
    {
      $sql = "
        SELECT
            COUNT(*) AS count
        FROM {$this->table}
        WHERE
            idDriver = :idDriver
            AND deleted_at IS NULL
      ";

      $bind = [
          ':idDriver' => $idDriver
      ];

      $result = $this->sqlRawSelect($sql, $bind)->first();

      return $result->count ?? 0;
    }

    public function deleteAllRegisterByDriver(int $driverId)
    {
      return $this->sqlUpdate(
          ['deleted_at' => ':deleted_at'],
          [['idDriver', '=', ':idDriver']],
          [
              ':deleted_at' => now(),
              ':idDriver' => $driverId
          ]
      );
    }
}