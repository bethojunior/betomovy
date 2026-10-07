<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/10/2019
 * Time: 17:36
 */

namespace App\Repositories\Place;


class PlaceSearchRepository
{
    public function search($query)
    {
        $query = $this->fullTextWildcards($query);

        return \DB::select('
            SELECT
               latitude,
               longitude,
               address,
               neighborhood,
               cityId,
               DATE_FORMAT(created_at, \'%Y-%m-%d\') as created_at
            FROM
                (SELECT
                    o.idOrigin,
                    null AS idDestination,
                    o.address,
                    o.neighborhood,
                    o.cityId,
                    o.latitude,
                    o.longitude,
                    o.created_at
                FROM origin o
                    WHERE
                        MATCH(a.`address`) AGAINST(? IN BOOLEAN MODE)
                    UNION
                SELECT
                    null AS idOrigin,
                    d.idDestination,
                    d.address,
                    d.neighborhood,
                    d.cityId,
                    d.latitude,
                    d.longitude,
                    d.created_at
                FROM destination d
                    WHERE
                        MATCH(a.`address`) AGAINST(? IN BOOLEAN MODE)
                    UNION
                SELECT
                    null AS idOrigin,
                    null AS idDestination,
                    a.address,
                    a.neighborhood,
                    null AS cityId,
                    a.latitude,
                    a.`longitude`,
                    a.created_at
                FROM address a
                    WHERE
                        a.statusId = 1 AND
                        MATCH(a.`address`) AGAINST(? IN BOOLEAN MODE)) as query
                GROUP BY address, created_at, latitude, longitude, neighborhood, cityId
                LIMIT 10
        ', [$query, $query, $query]);
    }

    public function searchNearby($query, $lat = null, $lng = null)
    {
        $query = $this->fullTextWildcards($query);

        $sql = "
            SELECT
               address,
               ANY_VALUE(latitude) AS latitude,
               ANY_VALUE(longitude) AS longiude,
               ANY_VALUE(neighborhood) AS neighborhood,
               ANY_VALUE(proximity) AS proximity,
               ANY_VALUE(DATE_FORMAT(created_at, '%Y-%m-%d')) as created_at
            FROM
                (SELECT
                    o.address,
                    o.neighborhood,
                    o.cityId,
                    o.latitude,
                    o.longitude,
                    (6371 * acos(
                         cos( radians(?) )
                         * cos( radians( o.latitude ) )
                         * cos( radians( o.longitude ) - radians(?) )
                         + sin( radians(?) )
                         * sin( radians( o.latitude ) )
                        )
                    ) AS proximity,
                    o.created_at
                FROM origin o
                    WHERE
                      MATCH(o.`address`) AGAINST(? IN NATURAL LANGUAGE MODE)
                    UNION
                SELECT
                    d.address,
                    d.neighborhood,
                    d.cityId,
                    d.latitude,
                    d.longitude,
                    (6371 * acos(
                         cos( radians(?) )
                         * cos( radians( d.latitude ) )
                         * cos( radians( d.longitude ) - radians(?) )
                         + sin( radians(?) )
                         * sin( radians( d.latitude ) )
                        )
                    ) AS proximity,
                    d.created_at
                FROM destination d
                    WHERE
                      MATCH(d.`address`) AGAINST(? IN NATURAL LANGUAGE MODE)
                    UNION
                SELECT
                    a.address,
                    a.neighborhood,
                    null AS cityId,
                    a.latitude,
                    a.`longitude`,
                    (6371 * acos(
                         cos( radians(?) )
                         * cos( radians( a.latitude ) )
                         * cos( radians( a.longitude ) - radians(?) )
                         + sin( radians(?) )
                         * sin( radians( a.latitude ) )
                        )
                    ) AS proximity,
                    a.created_at
                FROM address a
                    WHERE
                        a.statusId = 1 AND
                        MATCH(a.`address`) AGAINST(? IN BOOLEAN MODE)) as query
                INNER JOIN config c ON c.`key` = 'radius_places_cache'
                WHERE proximity <= c.value
                GROUP BY address
                ORDER BY created_at DESC, proximity
                LIMIT 10
        ";

        return \DB::select($sql, [
            $lat,
            $lng,
            $lat,
            $query,
            $lat,
            $lng,
            $lat,
            $query,
            $lat,
            $lng,
            $lat,
            $query
        ]);
    }

    private function fullTextWildcards($term)
    {
        // removing symbols used by MySQL
        $reservedSymbols = ['-', '+', '<', '>', '@', '(', ')', '~'];
        $term = str_replace($reservedSymbols, '', $term);

        $words = explode(' ', $term);

        foreach($words as $key => $word) {
            /*
             * applying + operator (required word) only big words
             * because smaller ones are not indexed by mysql
             */
            if(strlen($word) >= 3) {
                $words[$key] = '+' . $word . '*';
            }
        }

        $searchTerm = implode( ' ', $words);

        return $searchTerm;
    }
}
