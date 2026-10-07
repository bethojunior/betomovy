<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/06/2019
 * Time: 11:25
 */

namespace App\Services\Config;


use App\Exceptions\Config\ConfigException;
use App\Helpers\Config\ConfigHelper;
use App\Repositories\CityConfig\CityConfigRepository;

class CityConfigService
{
    /**
     * @var CityConfigRepository
     */
    private $repository;
    /**
     * @var ConfigHelper
     */
    private $configHelper;

    public function __construct(CityConfigRepository $repository,
                                ConfigHelper $configHelper)
    {
        $this->repository = $repository;
        $this->configHelper = $configHelper;
    }

    /**
     * @param $request
     * @return CityConfigRepository|\Illuminate\Database\Eloquent\Model|null|object
     * @throws ConfigException
     */
    public function findByLocation($request)
    {
        $config = $this->repository
            ->getByCoordinate($request['lat'], $request['lng']);

        if (!$config)
            throw new ConfigException("Cidade não está habilitada");

        $config = $config->toArray();

        return array_merge($config, $this->configHelper->get(
            'mp_public_key',
            'cloud_firestore',
            'firebase_cloud_firestore_key'
        ));
    }
}
