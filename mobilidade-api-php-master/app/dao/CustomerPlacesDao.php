<?php

namespace app\dao;

use app\utils\BaseDao;
use Exception;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/10/2018
 * Time: 10:34
 */
class CustomerPlacesDao extends BaseDao
{
    protected $table = 'customerPlaces';

    public function getByCustomer($customerId)
    {
        $sql = "
            SELECT
              p.idPlace,
              p.alias,
              p.address,
              p.neighborhood,
              p.cityId,
              p.latitude,
              p.longitude,
              p.number,
              p.complement,
              p.referencePoint,
              p.deliveryNeighborhoodId,
              p.created_at
            FROM customerPlaces cp
              INNER JOIN places p on cp.placeId = p.idPlace
            WHERE cp.customerId = :customerId AND cp.statusId = :statusId
        ";

        $bind = [
            ':customerId' => $customerId,
            ':statusId' => Status::ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $customerId
     * @param $placeId
     * @return array|mixed
     */
    public function getOne($customerId, $placeId)
    {
        $sql = "
            SELECT
              p.idPlace,
              p.alias,
              p.address,
              p.neighborhood,
              p.cityId,
              p.latitude,
              p.longitude,
              p.number,
              p.complement,
              p.referencePoint,
              p.deliveryNeighborhoodId,
              p.created_at
            FROM customerPlaces cp
              INNER JOIN places p on cp.placeId = p.idPlace
            WHERE 
              cp.customerId = :customerId AND 
              p.idPlace = :placeId AND 
              cp.statusId = :statusId
        ";

        $bind = [
            ':customerId' => $customerId,
            ':placeId' => $placeId,
            ':statusId' => Status::ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    /**
     * @param $customerId
     * @param $placeId
     * @return bool
     * @throws Exception
     */
    public function delete($customerId, $placeId)
    {
        return $this->sqlUpdate(
            ['statusId' => ':statusExcluded'],
            [
                ['customerId', '=', ':customerId', 'AND'],
                ['placeId', '=', ':placeId', 'AND'],
                ['statusId', '=', ':statusActive'],
            ],
            [
                ':statusExcluded' => Status::EXCLUIDO,
                ':customerId' => $customerId,
                ':placeId' => $placeId,
                ':statusActive' => Status::ATIVO,
            ]
        );
    }
}