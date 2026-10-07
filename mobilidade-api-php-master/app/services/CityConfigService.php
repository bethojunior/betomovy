<?php

namespace app\services;

use app\constant\CacheKeyConst;
use app\model\AcquirerMetaData;
use app\dao\CityConfigDao;
use app\dao\ConfigDriverLocationDao;
use app\exceptions\CityConfigException;
use app\model\CityConfig;
use app\model\Config;
use app\utils\CacheUtils;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2019
 * Time: 19:16
 */
class CityConfigService
{
    private $dao;
    private CacheUtils $cache;

    public function __construct()
    {
        $this->dao = new CityConfigDao;
        $this->cache = new CacheUtils();
    }

    /**
     * @param $cityId
     * @return \app\model\CityConfig
     */
    public function getByCity($cityId): CityConfig
    {
        $config = $this->dao
            ->getByCity($cityId);

        return new CityConfig($config);
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws CityConfigException
     */
    public function findFully($request)
    {
        if (!isset($request->cityId) && (!isset($request->lat) && !isset($request->lng)))
            throw new CityConfigException(1510);

        if(isset($request->cityId)) {
        $configs = $this->cache->remember(CacheKeyConst::CITY_CONFIG. $request->cityId, env('REDIS_CACHE_TTL'), function () use ($request) {
                $config = $this->dao->getByCity($request->cityId);

                $config = isset($request->cityId) ?
                    $this->dao->getByCity($request->cityId) :
                    $this->getCityByCoordinates($request->lat, $request->lng);

                $config->mp_public_key = AcquirerMetaData::get('mp_public_key');
                $config->status_realtime_database =
                    (boolean)Config::get('cloud_firestore');
                $config->firebase_config =
                    json_decode(Config::get('firebase_cloud_firestore_key'));
                $config->configDriverLocation = (new ConfigDriverLocationDao)->find();

                if ($config->enabledDriverFields)
                    $config->enabledDriverFields = json_decode($config->enabledDriverFields);

                return $config;
            });

            return $configs;
        }

        $config = $this->getCityByCoordinates($request->lat, $request->lng);

        $config->mp_public_key =
            $this->cache->remember('mp_public_key', env('REDIS_CACHE_TTL'), function () {
                return AcquirerMetaData::get('mp_public_key');
            });
        $config->status_realtime_database =
            $this->cache->remember('cloud_firestore', env('REDIS_CACHE_TTL'), function () {
                return (boolean)Config::get('cloud_firestore');
            });
        $config->firebase_config =
            $this->cache->remember('firebase_config', env('REDIS_CACHE_TTL'), function () {
                return json_decode(Config::get('firebase_cloud_firestore_key'));
            });
        $config->configDriverLocation =
            $this->cache->remember('config_driver_location', env('REDIS_CACHE_TTL'), function () {
                return (new ConfigDriverLocationDao)->find();
            });

        if ($config->enabledDriverFields) {
            $config->enabledDriverFields =
                $this->cache->remember('enabled_driver_fields', env('REDIS_CACHE_TTL'), function () use ($config) {
                    return json_decode($config->enabledDriverFields);
                });
        }

        $this->cache->disconnect();
        return $config;
    }

    public function getCityByCoordinates($lat, $lng)
    {
        $config = $this->dao->getByCoordinate($lat, $lng);

        return $config;
    }

    public function googleApiKeyFront($request)
    {
        if (isset($request->lat) && isset($request->lng))
            $config = $this->dao
                ->getByCoordinate($request->lat, $request->lng);

        return $config->apiKeyGoogleFront ??
            Config::get('google_api_key');
    }
}