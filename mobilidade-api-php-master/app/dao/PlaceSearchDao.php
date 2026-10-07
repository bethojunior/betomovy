<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Config;
use app\model\Location;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/07/2019
 * Time: 15:07
 */
class PlaceSearchDao extends BaseDao
{
    public function search($query, array $allowedTypes = [])
    {
        $typeFilter = $this->buildTypeFilter($allowedTypes);

        $sql = "
           SELECT
                a.address,
                a.neighborhood,
                null                                             AS cityId,
                a.latitude,
                a.`longitude`,
                a.created_at,
                a.type,
                MATCH(a.address) AGAINST(:query IN BOOLEAN MODE) as relevance
            FROM address a
            WHERE a.statusId = 1
                AND MATCH(a.`address`) AGAINST(:query IN BOOLEAN MODE)
                {$typeFilter}
                GROUP BY address
            ORDER BY relevance DESC
                LIMIT 10;
        ";

        $bind = [':query' => "%{$query}%"];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function searchNearby($query, ?Location $latlng = null, int $radius = 0, array $allowedTypes = [])
    {
        $typeFilter = $this->buildTypeFilter($allowedTypes);

        $sql = "
            SELECT
                a.address,
                a.neighborhood,
                null                                             AS cityId,
                a.latitude,
                a.`longitude`,
                (
                    IF(:orderList, 6371 * acos(
                                    cos(radians(:lat))
                                    * cos(radians(a.latitude))
                                    * cos(radians(a.longitude) - radians(:lng))
                                + sin(radians(:lat))
                                        * sin(radians(a.latitude))
                        ), 0)
                    )                                            AS proximity,
                a.created_at,
                a.type,
                MATCH(a.address) AGAINST(:query IN BOOLEAN MODE) as relevance
            FROM address a
            WHERE a.statusId = 1
                AND (6371 * acos(
                        cos(radians(:lat))
                        * cos(radians(a.latitude))
                        * cos(radians(a.longitude) - radians(:lng))
                    + sin(radians(:lat))
                            * sin(radians(a.latitude))
                )) <= :radius
                AND MATCH(a.`address`) AGAINST(:query IN BOOLEAN MODE)
                AND a.blocked IS FALSE
                {$typeFilter}
                GROUP BY address
            ORDER BY relevance DESC, proximity
                LIMIT 10;
        ";

        $bind = [
            ':query' => $this->fullTextWildcards($query),
            ':lat' => $latlng->getLatitude(),
            ':lng' => $latlng->getLongitude(),
            ':radius' => $radius,
            ':orderList' => Config::get('order_type_cache_address'),
            ':deletedStatus' => Status::EXCLUIDO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    private function buildTypeFilter(array $allowedTypes): string
    {
        if (empty($allowedTypes)) return '';

        $conditions = [];

        if (in_array('manual', $allowedTypes)) {
            $conditions[] = 'a.manual = 1';
        }

        $apiTypes = array_values(array_filter($allowedTypes, fn($t) => $t !== 'manual'));
        if (!empty($apiTypes)) {
            $quoted = implode(',', array_map(fn($t) => "'{$t}'", $apiTypes));
            $conditions[] = "a.type IN ({$quoted})";
        }

        if (empty($conditions)) return '';

        return 'AND (' . implode(' OR ', $conditions) . ')';
    }

    private function fullTextWildcards($term)
    {
        // removing symbols used by MySQL
        $reservedSymbols = ['-', '+', '<', '>', '@', '(', ')', '~', 'Rua', 'rua', 'Av.', 'Avenida'];
        $term = str_replace($reservedSymbols, '', $term);

        $words = explode(' ', $term);

        $searchTerm = implode(' ', $words);

        return '\"' . $searchTerm . '\"';
    }
}
