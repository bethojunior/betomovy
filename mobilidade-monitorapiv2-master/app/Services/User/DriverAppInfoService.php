<?php


namespace App\Services\User;


use App\Repositories\User\Driver\DriverAppInfoRepository;

class DriverAppInfoService
{
    private $respository;

    public function __construct(DriverAppInfoRepository $repository)
    {
        $this->respository = $repository;
    }

    public function findByDriver($driverId, $date = null)
    {
        return $this->respository->findByDriver($driverId, $date);
    }
}
