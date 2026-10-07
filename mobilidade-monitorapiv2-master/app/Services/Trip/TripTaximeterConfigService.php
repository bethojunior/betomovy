<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/06/2020
 * Time: 11:36
 */

namespace App\Services\Trip;


use App\Models\Trip\TripTaximeterConfig;
use App\Repositories\Trip\TripTaximeterConfigRepository;

class TripTaximeterConfigService
{
    /**
     * @var TripTaximeterConfigRepository
     */
    private $repository;

    public function __construct(TripTaximeterConfigRepository $repository)
    {
        $this->repository = $repository;
    }

    public function insert(array $request): TripTaximeterConfig
    {
        $tripTaximeterConfig = new TripTaximeterConfig($request);
        $tripTaximeterConfig->save();

        return $tripTaximeterConfig;
    }
}
