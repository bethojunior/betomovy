<?php


namespace app\dao;

use app\utils\BaseDao;
use app\utils\Connection;

// Read-only class
class TaxDao extends BaseDao
{
    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findActivesByCityAndTripTypePaidByCustomer(int $cityId, int $tripTypeId)
    {
        return $this->sqlRawSelect("
            select `id`,
                   `name`,
                   `value`,
                   `valueType`,
                   `cityId`,
                   `tripTypeId`,
                   `chargeBy`
            from tax
            where active = true
              and cityId = :cityId
              and tripTypeId = :tripTypeId
              and chargeBy = 'customer'
              and deleted_at is null;
        ", [
            ':cityId' => $cityId,
            ':tripTypeId' => $tripTypeId
        ])
            ->get();
    }

    public function findByTrip($tripId)
    {
        return $this->sqlRawSelect("
            select tax.`id`,
                   tax.`name`,
                   tax.`value`,
                   tax.`valueType`,
                   tax.`cityId`,
                   tax.`tripTypeId`,
                   tax.`chargeBy`
            from tax
                inner join tripTax tT on tax.id = tT.taxId
            where tripId = :tripId
                and chargeBy = 'customer'
        ", [
            ':tripId' => $tripId
        ])->get();
    }

    public function findActivesByCityAndTripType(int $cityId, int $tripTypeId, ?array $chargeBy = ['customer', 'driver'])
    {
        $chargeByWhere = $chargeBy ? "and chargeBy in ('" . join("', '", $chargeBy) . "')" : '';

        return $this->sqlRawSelect("
            select `id`,
                   `name`,
                   `value`,
                   `valueType`,
                   `cityId`,
                   `tripTypeId`,
                   `chargeBy`
            from tax
            where active = true
              and cityId = :cityId
              and tripTypeId = :tripTypeId
              {$chargeByWhere}
              and deleted_at is null;
        ", [
            ':cityId' => $cityId,
            ':tripTypeId' => $tripTypeId
        ])
            ->get();
    }

    public function findMany(array $ids): array
    {
        return $this->sqlSelect([
            'id',
            'name',
            'value',
            'valueType',
            'cityId',
            'tripTypeId',
            'chargeBy'
        ], [
                ['id', ' IN ', '(' . join(', ', $ids) . ')']
            ]
        )->get();
    }
}