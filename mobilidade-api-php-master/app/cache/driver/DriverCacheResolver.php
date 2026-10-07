<?php

namespace app\cache\driver;

use app\constant\RedisKeysConst;
use app\model\Location;
use app\utils\GeoDistanceCalculator;
use app\utils\RedisUtil;
use app\utils\Pulse\GroupIds;
use app\utils\Pulse\GroupNames;
use app\utils\Pulse\PulseService;
use app\utils\Connection;
use app\traits\SqlTrait;

/** Made by Betho: The Eternal Romance  **/
class DriverCacheResolver
{
  use SqlTrait;

  public RedisUtil $redis;
  private $pulseService;

  public function __construct()
  {
    $this->redis = new RedisUtil();
    $this->dbType = Connection::DB_MYSQL;
    $this->table = 'driver';

    $this->pulseService = new PulseService(
      GroupNames::API_PHP_DRIVER_CACHE_RESOLVER,
      GroupIds::DRIVER_CACHE_RESOLVER,
    );
  }

  public function manageDriverLocation($driverId, Location $location)
  {
    $cacheKey = RedisKeysConst::returnDriverLocationKey($driverId);
    $syncKey  = RedisKeysConst::returnDriverLocationSyncKey($driverId);
    $data     = $location->toArray();

    $needsDbSync = $this->needsDbSync($syncKey, $location);

    try {
      $this->redis->set($cacheKey, json_encode($data), RedisKeysConst::TIME_DRIVER_LOCATION);

      if ($needsDbSync) {
        $this->redis->set(
          $syncKey,
          json_encode(['latitude' => $location->getLatitude(), 'longitude' => $location->getLongitude()]),
          RedisKeysConst::TIME_DRIVER_LOCATION_DB_SYNC
        );
        $this->syncLocationToDb($driverId, $location);
      }
    } catch (\Throwable $e) {
      $this->pulseService->handle('[DRIVERCACHE::MANAGEDRIVERLOCATION]', $e->getMessage(), 'critical');
    }

    $this->pulseService->handle('[DRIVERCACHE::MANAGEDRIVERLOCATION]', json_encode($data), 'info');
    return $location;
  }

  private function needsDbSync($syncKey, Location $location): bool
  {
    $lastSynced = $this->redis->get($syncKey);

    if (!$lastSynced) return true;

    $lastSyncedData = json_decode($lastSynced, true);

    if (
      json_last_error() !== JSON_ERROR_NONE
      || !is_array($lastSyncedData)
      || !isset($lastSyncedData['latitude'], $lastSyncedData['longitude'])
    ) return true;

    $distanceMoved = GeoDistanceCalculator::metersBetween(
      (float) $lastSyncedData['latitude'],
      (float) $lastSyncedData['longitude'],
      (float) $location->getLatitude(),
      (float) $location->getLongitude()
    );

    return $distanceMoved >= RedisKeysConst::DISTANCE_DRIVER_LOCATION_DB_SYNC_METERS;
  }

  private function syncLocationToDb($driverId, Location $location): void
  {
    $this->sqlUpdate(
      ['last_lat' => ':lat', 'last_lon' => ':lon', 'last_position_update' => ':now'],
      [['idDriver', '=', ':driverId']],
      [':lat' => $location->getLatitude(), ':lon' => $location->getLongitude(), ':now' => now(), ':driverId' => $driverId],
      false
    );
  }

  public function getDriverLocation($driverId, bool $asEntity = true)
  {
    $cacheKey = RedisKeysConst::returnDriverLocationKey($driverId);

    $cached = $this->redis->get($cacheKey);

    if ($cached) {
      $data = json_decode($cached, true);

      if (json_last_error() === JSON_ERROR_NONE) {
        return $asEntity ? new Location((object) $data) : $data;
      }
    }

    $currentLocation = $this->sqlSelect([
      'last_lat AS latitude',
      'last_lon AS longitude'
    ], [
      ['idDriver', '=', ':driverId']
    ], [], 1)
      ->bind([':driverId' => $driverId])
      ->get(false);

    if (!$currentLocation) return null;

    $data = (new Location($currentLocation))->toArray();

    try {
      $this->redis->set(
        $cacheKey,
        json_encode($data),
        RedisKeysConst::TIME_DRIVER_LOCATION
      );
    } catch (\Throwable $e) {
      $this->pulseService->handle('[DRIVERCACHE::GETDRIVERLOCATION]', $e->getMessage(), 'critical');
    }

    $this->pulseService->handle('[DRIVERCACHE::GETDRIVERLOCATION]', json_encode($data), 'info');
    return $asEntity ? new Location((object) $data) : $data;
  }
}
