<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/05/2020
 * Time: 09:29
 */
class CreditPrepaidDao extends BaseDao
{
    protected $table = 'creditPrepaid';

    /**
     * @param string|string[] $type Um tipo ('value'/'perPeriod') ou uma lista de tipos a buscar juntos.
     */
    public function findAll($type = 'value', $cityId = null)
    {
        $types = is_array($type) ? $type : [$type];

        $typeBindings = [];
        $typePlaceholders = [];
        foreach ($types as $index => $typeValue) {
            $placeholder = ":type{$index}";
            $typePlaceholders[] = $placeholder;
            $typeBindings[$placeholder] = $typeValue;
        }
        $typeInClause = implode(', ', $typePlaceholders);

        $sql = "
            SELECT
                cp.id,
                cp.superTitle,
                cp.stripe,
                cp.title,
                cp.purchasePrice,
                cp.sellPrice,
                cp.accountInformation,
                cp.type,
                cp.quantityDaysSold,
                cp.quantityDaysPurchased,
                cp.created_at,
                cp.updated_at
            FROM {$this->table} cp
                WHERE
                    cp.deleted_at IS NULL AND
                    cp.type IN ({$typeInClause}) AND
                    (
                        cp.cityId = :cityId OR
                        cp.cityId IS NULL
                    )
        ";

        return $this->sqlRawSelect($sql, $typeBindings + [
            ':cityId' => $cityId
        ])
            ->get();
    }

    public function find(int $id)
    {
        return $this->sqlSelect([], [
            ['id', '=', ':id']
        ])
            ->bind([':id' => $id])
            ->first();
    }
}