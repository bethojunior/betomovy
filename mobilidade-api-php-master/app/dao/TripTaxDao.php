<?php


namespace app\dao;

use app\utils\BaseDao;

class TripTaxDao extends BaseDao
{
    protected $table = "tripTax";

    public function findByTrip(int $idTrip, ?array $chargeBy = ['customer', 'driver']): array
    {
        $chargeByWhere = $chargeBy ? "and chargeBy in ('" . join("', '", $chargeBy) . "')" : '';

        $sql = "
            select tax.id,
                   tax.name,
                   tax.value,
                   tax.valueType,
                   tax.description,
                   tax.cityId,
                   tax.tripTypeId,
                   tax.chargeBy
            from tripTax
                     inner join tax on tripTax.taxId = tax.id
            where tripId = :tripId
              {$chargeByWhere};
        ";
        $bind = [':tripId' => $idTrip];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}