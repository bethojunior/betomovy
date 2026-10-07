<?php

namespace app\services;

use app\dao\PlaceSearchDao;
use app\utils\PlaceService;
use app\utils\Headers;
use app\model\Config;
use Exception;
use app\model\Location;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/07/2019
 * Time: 15:06
 */
class PlaceSearchService
{
    private $dao;
    private $placeService;

    public function __construct()
    {
        $this->dao = new PlaceSearchDao;
        $this->placeService = new PlaceService;
    }

    /**
     * @param $request
     * @return array|mixed|null
     * @throws Exception
     */
    public function search($request)
    {
        if (!isset($request->q))
            return null;

        $latlng = $this->mountLatlng($request->latlng ?? null);

        $configs = Config::getMany(
            'minimum_number_cached_addresses',
            'radius_places_cache'
        );

        $query = $this->mountPlaceQuery($request->q);

        $radius = (int)$configs['radius_places_cache'];

        if (isset($request->source) && $request->source === 'central') {
            $headerRadius = (int)Headers::getCentralRadius();
            $headerEnabled = (bool)Headers::getCentralCustomEnabled();

            if ($headerEnabled && $headerRadius > 0) {
                $radius = $headerRadius;
            }
        }

        $results = [];
        $results = $radius > 0 ? $this->searchOnDBCache($query, $latlng, $radius) : [];

        if (empty($results) || count($results) < (int) $configs['minimum_number_cached_addresses']) {
            $newResults = $this->placeService->search($query, $request->latlng ?? null);

            $type = $this->placeService->getDefaultAPI();

            $newResults = array_map(function ($item) use ($type) {
                $item->type = $type;
                return $item;
            }, $newResults);

            $results = is_array($results) ? array_merge($results, $newResults) : $newResults;
        }

        return array_map(function ($result) {
            $result->address = str_replace('\'', '', $result->address);

            return $result;
        }, $results);
    }

    private function searchOnDBCache($query, ?Location $latlng, int $radius)
    {
        $allowedTypes = $this->resolveAllowedCacheTypes();

        if ($latlng) {
            return $this->dao->searchNearby($query, $latlng, $radius, $allowedTypes);
        } else {
            return $this->dao->search($query, $allowedTypes);
        }
    }

    private function resolveAllowedCacheTypes(): array
    {
        $configRaw = Config::get('map_api_for_address_cache');
        if (!$configRaw) return [];

        $decoded = json_decode($configRaw, true);
        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @param null|string $latlng_string
     * @return \app\model\Location|null
     */
    private function mountLatlng(?string $latlng_string): ?Location
    {
        if (!$latlng_string)
            return null;

        $latlng = explode(',', $latlng_string);

        if (count($latlng) == 2)
            return new Location([
                'latitude' => $latlng[0],
                'longitude' => $latlng[1],
            ]);

        return null;
    }

    private function mountPlaceQuery(string $query)
    {
        return str_replace(['\'', '`'], '', $query);
    }
}
