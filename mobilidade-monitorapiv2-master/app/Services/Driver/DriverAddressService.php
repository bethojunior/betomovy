<?php

namespace App\Services\Driver;

use App\Exceptions\City\CityNotFoundException;
use App\Exceptions\Driver\DriverNotFoundException;
use App\Models\Driver\DriverAddress;
use App\Repositories\Locale\CityRepository;
use App\Repositories\User\Driver\DriverAddressRepository;
use App\Repositories\User\DriverRepository;

class DriverAddressService
{
    private DriverRepository $driverRepository;
    private DriverAddressRepository $driverAddressRepository;
    private CityRepository $cityRepository;

    public function __construct(
        DriverRepository $driverRepository,
        DriverAddressRepository $driverAddressRepository,
        CityRepository $cityRepository
    )
    {
        $this->driverRepository = $driverRepository;
        $this->driverAddressRepository = $driverAddressRepository;
        $this->cityRepository = $cityRepository;
    }

    public function store(int $driverId, array $request): DriverAddress
    {
        $driver = $this->driverRepository->findOneActive($driverId, ['driverAddress']);

        if (!$driver) {
            throw new DriverNotFoundException();
        }

        $city = $this->cityRepository->findById($request['cityId']);

        if (!$city) {
            throw new CityNotFoundException();
        }

        $data = array_merge([
            'city'  => $city->nome,
            'state' => strtoupper($city->state->sigla),
        ], $request);

        unset($data['cityId']);

        return $this->driverAddressRepository
            ->updateOrCreate([
                'driverId' => $driverId
            ], $data);
    }
}
