<?php

namespace app\utils;

use app\constant\MapServiceConst;
use app\constant\MapTypeConst;
use app\dao\CityDao;
use app\dao\LogDao;
use app\dao\MapServiceMetaDataDao;
use app\model\Config;
use Exception;
use stdClass;
use app\utils\RedisUtil;
use app\utils\CoordValidator;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/08/2019
 * Time: 09:23
 */
class DirectionService
{
    private const CACHE_TTL = 1800;

    private $defaultAPI;
    private $servicesList;
    private $servicesListByCity;
    private $tokenConcat = '';

    public function __construct()
    {
        $this->loadConfigs();
    }

    private function loadConfigs()
    {
        $this->servicesList = json_decode(Config::get('service_priority_direction'));
        $this->servicesListByCity = json_decode(Config::get('service_priority_direction'));

        $this->servicesList = array_diff($this->servicesList, ['seumilto']);
        $this->servicesListByCity = array_diff($this->servicesListByCity, ['seumilto']);

        $this->getFirstService();
    }

    private function getFirstService()
    {
        if (((bool)Config::get('enable_custom_mode_of_map_services'))) {
            $this->defaultAPI = $this->getNextService();
        } else {
            $this->defaultAPI = $defaultMapsApi ?? Config::get('default_maps_api');
        }
    }

    /**
     * @param $request
     * @param bool $freeDirections
     * @param bool $isFirst
     * @return mixed
     * @throws Exception
     */
    private function roundCoord(string $coord, int $decimals = 4): string
    {
        $parts = explode(',', $coord);
        if (count($parts) !== 2) return $coord;
        $factor = pow(10, $decimals);
        return (floor((float)$parts[0] * $factor) / $factor) . ',' . (floor((float)$parts[1] * $factor) / $factor);
    }

    public function getRoute($request, bool $freeDirections = false, bool $isFirst = true)
    {
        $this->requestIsValid($request);

        $redis = new RedisUtil();
        $originRounded = $this->roundCoord($request->origin ?? '');
        $destRounded = $this->roundCoord($request->destination ?? '');
        $cacheKey = "direction:route:" . md5($originRounded . ":" . $destRounded . ":" . json_encode($request->waypoints ?? []));
        $cached = $redis->get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        $result = null;
        if ($request->origin) {
            $position = explode(",", $request->origin);
            $city = (new CityDao)->findByCoordinate($position[0], $position[1]);

            if ($city && (new MapServiceMetaDataDao)->existKeyByCity($city->id)) {
                $result = $this->getRouteCityConfig($request, $city->id, $isFirst);
            }
        }

        if (!$result) {
            $this->getFirstService();
            $result = $this->getRouteGeneralConfig($request, $freeDirections, $isFirst);
        }

        $redis->set($cacheKey, $result, self::CACHE_TTL);
        return $result;
    }


    /**
     * @param $request
     * @param bool $freeDirections
     * @param bool $isFirst
     * @return mixed
     * @throws Exception
     */
    private function getRouteGeneralConfig($request, bool $freeDirections = false, bool $isFirst = true)
    {
        $origin = explode(',', $request->origin);
        $destination = explode(',', $request->destination);

        if (isset($request->waypoints))
            $waypoints = array_map(function ($waypoint) {
                return explode(",", $waypoint);
            }, explode('|', $request->waypoints));

        if ($freeDirections && (bool)Config::get('enable_freedirections'))
            $this->defaultAPI = 'mapbox';

        if (!$isFirst)
            $this->defaultAPI = $this->getNextService();

        $defaultApi = $this->choiceDefaultApi();

        $this->removeService($this->defaultAPI);

        try {
            $result = $defaultApi
                ->getDistance(
                    $origin[0], $origin[1], $destination[0], $destination[1], $waypoints ?? null);
        } catch (Exception $exception) {
            if (count($this->servicesList) == 0) {
                $service = MapServiceConst::DIRECTIONS;
                $this->tokenConcat .= $defaultApi->getApiKey();
                $this->notifyAlert($this->defaultAPI, $service, $defaultApi->getApiKey());
                $this->notifyAlert(MapTypeConst::CRITICAL, $service, $this->tokenConcat);

                throw new Exception("Não foi possível obter um serviço de mapa: " . $exception->getMessage());
            } else {
                $service = MapServiceConst::DIRECTIONS;
                $this->tokenConcat .= $defaultApi->getApiKey();
                $this->notifyAlert($this->defaultAPI, $service, $defaultApi->getApiKey());

                return $this->getRouteGeneralConfig($request, $freeDirections, false);
            }
        }

        return $result;
    }

    /**
     * @param $request
     * @param bool $freeDirections
     * @param $cityId
     * @param bool $isFirst
     * @return mixed|object|stdClass
     * @throws Exception
     */
    private function getRouteCityConfig($request, $cityId, bool $isFirst = true)
    {
        $origin = explode(',', $request->origin);
        $destination = explode(',', $request->destination);

        if (isset($request->waypoints))
            $waypoints = array_map(function ($waypoint) {
                return explode(",", $waypoint);
            }, explode('|', $request->waypoints));

        if (!$isFirst) {
            $this->defaultAPI = $this->getNextServiceByCity();
        }

        $defaultApi = $this->choiceDefaultByCityApi($cityId);

        $this->removeServiceByCity($this->defaultAPI);

        if (empty($defaultApi->getApiKey())) {
            if (count($this->servicesListByCity) == 0) return null;
            return $this->getRouteCityConfig($request, $cityId, false);
        }

        try {
            $result = $defaultApi
                ->getDistance(
                    $origin[0], $origin[1], $destination[0], $destination[1], $waypoints ?? null);
        } catch (Exception $exception) {
            if (count($this->servicesListByCity) == 0) {
                return null;
            } else {
                return $this->getRouteCityConfig($request, $cityId, false);
            }
        }

        return $result;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param array|null $waypoints
     * @param bool $isFirst
     * @return mixed
     * @throws Exception
     */
    private function filterValidWaypoints(?array $waypoints): ?array
    {
        if (empty($waypoints)) return null;
        $valid = array_values(array_filter($waypoints, function ($wp) {
            if (is_object($wp)) {
                $wp = get_object_vars($wp);
            }
            if (!is_array($wp)) {
                return false;
            }
            // Suporta {latitude, longitude} e formato legado [lat, lng]
            $lat = $wp['latitude'] ?? $wp[0] ?? null;
            $lng = $wp['longitude'] ?? $wp[1] ?? null;
            return is_numeric($lat) && is_numeric($lng);
        }));
        return empty($valid) ? null : $valid;
    }

    public function getDistance(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null, bool $isFirst = true)
    {
        $waypoints = $this->normalizeWaypoints($this->filterValidWaypoints($waypoints));

        $redis = new RedisUtil();
        $startRounded = $this->roundCoord("{$start_latitude},{$start_longitude}");
        $endRounded = $this->roundCoord("{$end_latitude},{$end_longitude}");
        $waypointsKey = $this->serializeWaypointsKey($waypoints);
        $cacheKey = "direction:distance:" . md5("{$startRounded}:{$endRounded}:{$waypointsKey}");
        $cached = $redis->get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        $result = null;
        if ($start_latitude && $start_longitude) {
            $city = (new CityDao)->findByCoordinate($start_latitude, $start_longitude);

            if ($city && (new MapServiceMetaDataDao)->existKeyByCity($city->id)) {
                $result = $this->getDistanceCityConfig($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints, $city->id, $isFirst);
            }
        }

        if (!$result) {
            $this->getFirstService();
            $result = $this->getDistanceGeneralConfig($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints, $isFirst);
        }

        $redis->set($cacheKey, $result, self::CACHE_TTL);
        return $result;
    }


    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param array|null $waypoints
     * @param bool $isFirst
     * @return mixed
     * @throws Exception
     */
    public function getDistanceGeneralConfig(
        $start_latitude,
        $start_longitude,
        $end_latitude,
        $end_longitude,
        array $waypoints = null,
        bool $isFirst = true,
        string $errorLog = '')
    {
        if (!$isFirst)
            $this->defaultAPI = $this->getNextService();

        $defaultApi = $this->choiceDefaultApi();

        $this->removeService($this->defaultAPI);

        try {
            $result = $defaultApi
                ->getDistance($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints);
        } catch (Exception $exception) {
            $errorLog .= "[{$this->defaultAPI}] " . $exception->getMessage() . " | ";

            if (count($this->servicesList) == 0) {
                $service = MapServiceConst::DIRECTIONS;
                $this->tokenConcat .= $defaultApi->getApiKey();
                $this->notifyAlert($this->defaultAPI, $service, $defaultApi->getApiKey());
                $this->notifyAlert(MapTypeConst::CRITICAL, $service, $this->tokenConcat);

                (new LogDao)->logException($exception);

                throw new Exception(
                    "Serviço de mapa temporariamente indisponível. " .
                    "Provedores: " . rtrim($errorLog, ' | ')
                );
            } else {
                $service = MapServiceConst::DIRECTIONS;
                $this->tokenConcat .= $defaultApi->getApiKey();
                $this->notifyAlert($this->defaultAPI, $service, $defaultApi->getApiKey());

                return $this->getDistanceGeneralConfig($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints, false, $errorLog);
            }
        }

        return $result;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param array|null $waypoints
     * @param bool $isFirst
     * @return mixed
     * @throws Exception
     */
    private function getDistanceCityConfig(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null, $cityId, bool $isFirst = true)
    {
        if (!$isFirst)
            $this->defaultAPI = $this->getNextServiceByCity();

        $defaultApi = $this->choiceDefaultByCityApi($cityId);

        $this->removeServiceByCity($this->defaultAPI);

        if (empty($defaultApi->getApiKey())) {
            if (count($this->servicesListByCity) == 0) return null;
            return $this->getDistanceCityConfig($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints, $cityId, false);
        }

        try {
            $result = $defaultApi
                ->getDistance($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints);
        } catch (Exception $exception) {
            if (count($this->servicesListByCity) == 0) {
                return null;
            } else {
                return $this->getDistanceCityConfig($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints, $cityId, false);
            }
        }

        return $result;
    }

    private function removeService($service)
    {
        $newArray = array();

        foreach ($this->servicesList as $type) {
            if ($service != $type) {
                $newArray[] = $type;
            }
        }

        $this->servicesList = $newArray;
    }


    private function removeServiceByCity($service)
    {
        $newArray = array();

        foreach ($this->servicesListByCity as $type) {
            if ($service != $type) {
                $newArray[] = $type;
            }
        }

        $this->servicesListByCity = $newArray;
    }

    private function getNextService()
    {
        return $this->servicesList[0];
    }


    private function getNextServiceByCity()
    {
        return $this->servicesListByCity[0];
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param bool $isFirst
     * @return mixed
     * @throws Exception
     */
    public function getDistanceWithFullAddress(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, bool $isFirst = true)
    {
        $redis = new RedisUtil();
        $startRounded = $this->roundCoord("{$start_latitude},{$start_longitude}");
        $endRounded = $this->roundCoord("{$end_latitude},{$end_longitude}");
        $cacheKey = "direction:full-address:" . md5("{$startRounded}:{$endRounded}");
        $cached = $redis->get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        $result = null;
        if ($start_latitude && $start_longitude) {
            $city = (new CityDao)->findByCoordinate($start_latitude, $start_longitude);

            if ($city && (new MapServiceMetaDataDao)->existKeyByCity($city->id)) {
                $result = $this->getDistanceWithFullAddressCityConfig($start_latitude, $start_longitude, $end_latitude, $end_longitude, $city->id, $isFirst);
            }
        }

        if (!$result) {
            $this->getFirstService();
            $result = $this->getDistanceWithFullAddressGeneralConfig($start_latitude, $start_longitude, $end_latitude, $end_longitude, $isFirst);
        }

        $redis->set($cacheKey, $result, self::CACHE_TTL);
        return $result;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param bool $isFirst
     * @return mixed
     * @throws Exception
     */
    public function getDistanceWithFullAddressGeneralConfig(
        $start_latitude,
        $start_longitude,
        $end_latitude,
        $end_longitude,
        bool $isFirst = true
    )
    {
        if (!$isFirst)
            $this->defaultAPI = $this->getNextService();

        $defaultApi = $this->choiceDefaultApi();

        $this->removeService($this->defaultAPI);

        try {
            $result = $defaultApi
                ->getDistanceWithFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude);
        } catch (Exception $exception) {
            if (count($this->servicesList) == 0) {
                $service = MapServiceConst::DIRECTIONS;
                $this->tokenConcat .= $defaultApi->getApiKey();
                $this->notifyAlert($this->defaultAPI, $service, $defaultApi->getApiKey());
                $this->notifyAlert(MapTypeConst::CRITICAL, $service, $this->tokenConcat);

                throw new Exception("Não foi possível obter um serviço de mapa: " . $exception->getMessage());
            } else {
                $service = MapServiceConst::DIRECTIONS;
                $this->tokenConcat .= $defaultApi->getApiKey();
                $this->notifyAlert($this->defaultAPI, $service, $defaultApi->getApiKey());

                return $this->getDistanceWithFullAddressGeneralConfig($start_latitude, $start_longitude, $end_latitude, $end_longitude, false);
            }
        }

        return $result;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param $cityId
     * @param bool $isFirst
     * @return mixed|stdClass|void|null
     * @throws Exception
     */
    private function getDistanceWithFullAddressCityConfig(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, $cityId, bool $isFirst = true)
    {
        if (!$isFirst)
            $this->defaultAPI = $this->getNextServiceByCity();

        $defaultApi = $this->choiceDefaultByCityApi($cityId);

        $this->removeServiceByCity($this->defaultAPI);

        if (empty($defaultApi->getApiKey())) {
            if (count($this->servicesListByCity) == 0) return null;
            return $this->getDistanceWithFullAddressCityConfig($start_latitude, $start_longitude, $end_latitude, $end_longitude, $cityId, false);
        }

        try {
            $result = $defaultApi
                ->getDistanceWithFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude);
        } catch (Exception $exception) {
            if (count($this->servicesListByCity) == 0) {
                return null;
            } else {
                return $this->getDistanceWithFullAddressCityConfig($start_latitude, $start_longitude, $end_latitude, $end_longitude, $cityId, false);
            }
        }

        return $result;
    }

    function notifyAlert($type, $service, $token)
    {
        //exec("nohup php ../console/command.php notify-service-change {$type} {$service} {$token} > /dev/null 2>&1 & echo $! ");
    }

    /**
     * @return mixed|string|null
     */
    public function getDefaultAPI()
    {
        return $this->defaultAPI;
    }

    /**
     * @return \app\contracts\DirectionsApiInterface
     * @throws Exception
     */
    private function choiceDefaultApi()
    {
        switch ($this->defaultAPI) {
            case 'google':
                return new GoogleMapsApi;
            case 'here':
                return new HereDistanceApi;
            case 'mapbox':
                return new MapBoxApi;
            case 'osrm':
                return new OSRMDirectionsApi;
            case 'seumilto':
                return new SeuMiltoDirectionsApi;
            default:
                throw new Exception("Erro ao encontrar API Padrão");
        }
    }

    /**
     * @param null $cityId
     * @return GoogleMapsApi|HereDistanceApi|MapBoxApi|OSRMDirectionsApi|SeuMiltoDirectionsApi
     * @throws Exception
     */
    private function choiceDefaultByCityApi($cityId = null)
    {
        switch ($this->defaultAPI) {
            case 'google':
                return new GoogleMapsApi($cityId);
            case 'here':
                return new HereDistanceApi($cityId);
            case 'mapbox':
                return new MapBoxApi($cityId);
            case 'seumilto':
                return new SeuMiltoDirectionsApi();
            default:
                throw new Exception("Erro ao encontrar API Padrão");
        }
    }

    /**
     * @param $request
     * @throws Exception
     */
    private function requestIsValid($request)
    {
        if (!isset($request->origin))
            throw new Exception("Origem não enviada");

        if (!isset($request->destination))
            throw new Exception("Destino não enviado");

        if (!CoordValidator::isValid($request->origin))
            throw new Exception("Origem inválida: {$request->origin}");

        if (!CoordValidator::isValid($request->destination))
            throw new Exception("Destino inválido: {$request->destination}");
    }

    private function serializeWaypointsKey(?array $waypoints): string
    {
        return implode('|', array_map(function ($w) {
            return is_array($w) ? implode(',', $w) : $w;
        }, $waypoints ?? []));
    }

    private function normalizeWaypoints(?array $waypoints): ?array
    {
        if (!$waypoints) return $waypoints;

        return array_map(function ($w) {
            return is_object($w) ? [(float)$w->latitude, (float)$w->longitude] : $w;
        }, $waypoints);
    }
}
