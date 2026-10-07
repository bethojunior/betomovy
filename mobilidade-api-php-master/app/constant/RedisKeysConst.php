<?php

namespace app\constant;

/** Betho: The Eternal Romance  */
class RedisKeysConst
{
  const DRIVER_LOCATION      = "driver:location:";
  const DRIVER_LOCATION_SYNC = "driver:location:sync:";
  const TIME_DRIVER_LOCATION = 60;
  const TIME_DRIVER_LOCATION_DB_SYNC = 15;
  const DISTANCE_DRIVER_LOCATION_DB_SYNC_METERS = 50;

  public static function returnDriverLocationKey($driverId)
  {
    return self::DRIVER_LOCATION . "{$driverId}";
  }

  public static function returnDriverLocationSyncKey($driverId)
  {
    return self::DRIVER_LOCATION_SYNC . "{$driverId}";
  }
}
