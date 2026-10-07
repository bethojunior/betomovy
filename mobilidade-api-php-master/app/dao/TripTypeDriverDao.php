<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use app\utils\Connection;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/02/2019
 * Time: 15:42
 */
class TripTypeDriverDao extends BaseDao
{
    protected $table = 'tripTypeDriver';

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findDriverTypes($tripTypeId)
    {
        $sql = "
            SELECT
                ttd.userTypeId,
                u.name AS driverType
            FROM tripTypeDriver ttd
              INNER JOIN userType u on ttd.userTypeId = u.idUserType
              WHERE ttd.tripTypeId = :tripTypeId
        ";

        $bind = [':tripTypeId' => $tripTypeId];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function findTripTypes($userTypeId)
    {
        $sql = "
            SELECT
                ttd.tripTypeId,
                tt.type AS tripType
            FROM tripTypeDriver ttd
              INNER JOIN tripType tt on ttd.tripTypeId = tt.idTripType
              WHERE 
                ttd.userTypeId = :userTypeId AND
                tt.statusId = :status
        ";

        $bind = [
            ':userTypeId' => $userTypeId,
            ':status' => Status::ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}