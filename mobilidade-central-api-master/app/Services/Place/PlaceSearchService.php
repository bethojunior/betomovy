<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/10/2019
 * Time: 17:35
 */

namespace App\Services\Place;


use App\Helpers\Maps\PlaceHelper;
use App\Repositories\Place\PlaceSearchRepository;

class PlaceSearchService
{
    /**
     * @var PlaceSearchRepository
     */
    private $repository;
    /**
     * @var PlaceHelper
     */
    private $placeHelper;

    public function __construct(PlaceSearchRepository $repository,
                                PlaceHelper $placeHelper)
    {
        $this->repository = $repository;
        $this->placeHelper = $placeHelper;
    }

    /**
     * @param array $request
     * @return array
     * @throws \App\Exceptions\Helper\PlaceHelperException
     */
    public function search(array $request)
    {
        $latlng = $this->mountLatlng($request['latlng'] ?? null);

        $results = $this->searchOnCache($request['q'], $latlng);

        if (!$results)
            $results = $this->placeHelper
                ->search($request['q'], $request['latlng'] ?? null);

        return $results;
    }

    private function searchOnCache($query, $latlng)
    {
        if ($latlng)
            return $this->repository
                ->searchNearby($query, $latlng['lat'], $latlng['lng']);

        return $this->repository
            ->search($query);
    }

    /**
     * @param null|string $latlng_string
     * @return null
     */
    private function mountLatlng(?string $latlng_string)
    {
        if (!$latlng_string)
            return null;

        $latlng = explode(',', $latlng_string);

        if (count($latlng) == 2)
            return [
                'lat' => $latlng[0],
                'lng' => $latlng[1],
            ];

        return null;
    }
}
