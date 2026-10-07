<?php

namespace app\commands;

use app\utils\Command;
use app\utils\GeocodingService;

class FindGeocodingCommand extends Command
{
    private $geocodingService;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->geocodingService = new GeocodingService();
    }


    public function handle(): void
    {
        $latitude = $this->params[2];
        $longitude = $this->params[3];
        $address = $this->geocodingService->search("{$latitude},{$longitude}", true);
        $this->response = (object)[
            'address' => $address->getAddress(),
            'number' => $address->getNumber(),
            'street' => $address->getStreet(),
            'neighborhood' => $address->getNeighborhood(),
            'city' => $address->getCity(),
            'state' => $address->getEstate(),
            'country' => $address->getCountry(),
            'postalCode' => $address->getPostalCode(),
            'latitude' => $address->getLatitude(),
            'longitude' => $address->getLongitude(),
        ];
    }
}