<?php

namespace app\services;

use app\utils\GeocodingService;

use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/10/2019
 * Time: 09:17
 */
class GeocodingSearchService
{
    private $geocodingService;

    public function __construct()
    {
        $this->geocodingService = new GeocodingService;
    }

    /**
     * @param $request
     * @return array|null
     * @throws Exception
     */
    public function search($request)
    {
        if (!isset($request->address) && !isset($request->latlng))
            return null;

        $address = $request->latlng ?? $request->address;

//        $address = preg_replace(["/[0-9]{5}-[0-9]{3}$/"], '', $address);

        $result = $this->geocodingService
            ->search($address, isset($request->latlng));

        return $result->toArray();
    }
}