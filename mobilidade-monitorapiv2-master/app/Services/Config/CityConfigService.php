<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/06/2019
 * Time: 11:25
 */

namespace App\Services\Config;

use App\Constants\Cache\CacheKeyConst;
use App\Exceptions\Config\CityConfigException;
use App\Exceptions\Config\ConfigException;
use App\Helpers\Cache\CacheHelper;
use App\Models\Config\CityConfig;
use App\Repositories\CityConfig\CityConfigRepository;
use App\Repositories\CityConfig\CityConfigViewRepository;
use App\Repositories\Config\ConfigRepository;
use Illuminate\Support\Facades\Cache;

class CityConfigService
{
    private const GLOBAL_CONFIG_KEYS = [
        'whatsapp_zafira_validated_driver_message',
        'whatsapp_zafira_validated_client_message',
    ];

    /**
     * @var CityConfigRepository
     */
    private $repository;
    /**
     * @var CityConfigViewRepository
     */
    private $viewRepository;
    /**
     * @var ConfigRepository
     */
    private $configRepository;

    public function __construct(
        CityConfigRepository $repository,
        CityConfigViewRepository $viewRepository,
        ConfigRepository $configRepository
    ) {
        $this->repository = $repository;
        $this->viewRepository = $viewRepository;
        $this->configRepository = $configRepository;
    }

    public function findByCity($id)
    {
        return $this->viewRepository
            ->findByCity($id);
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

        return $config;
    }

    /**
     * @param $cityId
     * @param array $request
     * @return CityConfigViewRepository[]|\Illuminate\Database\Eloquent\Collection
     * @throws CityConfigException
     */
    public function update($cityId, array $request)
    {
        $cityConfigData = [];
        foreach ($request as $key => $value) {
            if (in_array($key, self::GLOBAL_CONFIG_KEYS, true)) {
                $this->updateGlobalConfigValue($key, $value);
                continue;
            }
            $cityConfigData[$key] = $value;
        }
        if (!empty($cityConfigData)) {
            /** @var CityConfig $cityConfig */
            $cityConfig = $this->repository
                ->findByCity($cityId);
            if (!$cityConfig) {
                throw new CityConfigException("Configuração não encontrada para essa cidade");
            }
            foreach (array_keys($cityConfigData) as $key) {
                $cityConfig->$key = $cityConfigData[$key];
            }
            $this->repository
                ->save($cityConfig);
            Cache::forget(CacheHelper::processKey(CacheKeyConst::CITY_CONFIG));
            Cache::forget(CacheHelper::processKey(CacheKeyConst::CLOUD_FIRESTORE));
            Cache::forget(CacheHelper::processKey(CacheKeyConst::FIREBASE_CONFIG));
        }

        return $this->viewRepository
            ->findByCity($cityId);
    }

    private function updateGlobalConfigValue(string $key, $value): void
    {
        $config = $this->configRepository->findByKey($key);
        if (!$config) {
            throw new CityConfigException("Configuração global não encontrada: {$key}");
        }
        $config->value = $value;
        $this->configRepository->save($config);
    }

    /**
     * @param $cityId
     * @param array $request
     * @return CityConfigViewRepository[]|\Illuminate\Database\Eloquent\Collection
     * @throws CityConfigException
     */
    public function insert($cityId, array $request)
    {
        /** @var CityConfig $cityConfig */
        $cityConfig = $this->repository
            ->findByCity($cityId);

        if ($cityConfig)
            throw new CityConfigException("Essa cidade já possui configuração");

        $cityConfig = new CityConfig($request);

        $cityConfig
            ->cityId = $cityId;

        $this->repository
            ->save($cityConfig);

        return $this->viewRepository
            ->findByCity($cityId);
    }
}
