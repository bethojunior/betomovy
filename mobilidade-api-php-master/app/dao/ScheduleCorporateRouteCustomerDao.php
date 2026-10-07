<?php


namespace app\dao;

use app\utils\BaseDao;

class ScheduleCorporateRouteCustomerDao extends BaseDao
{
    protected $table = 'scheduleCorporateRouteCustomer';

    public function findCustomerByCorporateRoute($scheduleCorporateRouteId)
    {

        $sql = "
            SELECT *
            FROM scheduleCorporateRouteCustomer sCRC
                INNER JOIN corporateRouteCustomer cRC ON sCRC.corporateRouteCustomerId = cRC.id
            WHERE sCRC.scheduleCorporateRouteId = :scheduleCorporateRouteId
              AND sCRC.statusId = :statusId AND cRC.statusId = :statusId
        ";

        $bind = [
            ':statusId' => 1,
            ':scheduleCorporateRouteId' => $scheduleCorporateRouteId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function findCustomerById($scheduleCorporateRouteCustomerId)
    {
        $sql = "
            SELECT *
            FROM scheduleCorporateRouteCustomer sCRC
                INNER JOIN corporateRouteCustomer cRC ON sCRC.corporateRouteCustomerId = cRC.id
            WHERE sCRC.id = :scheduleCorporateRouteCustomerId
              AND sCRC.statusId = :statusId AND cRC.statusId = :statusId
        ";

        $bind = [
            ':statusId' => 1,
            ':scheduleCorporateRouteCustomerId' => $scheduleCorporateRouteCustomerId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

}