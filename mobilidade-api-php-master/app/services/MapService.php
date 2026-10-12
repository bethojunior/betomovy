<?php


namespace app\services;

use app\dao\LogDao;
use app\utils\DirectionService;
use app\utils\GeocodingService;
use app\utils\GoogleGeocodingApi;
use app\utils\GoogleMapsApi;
use app\utils\GooglePlacesApi;
use app\utils\HereDistanceApi;
use app\utils\HereGeocodingApi;
use app\utils\HerePlacesApi;
use app\utils\MapBoxApi;
use app\utils\MapBoxGeocodingApi;
use app\utils\MapBoxPlacesApi;
use app\utils\PlaceService;
use app\model\Config;
use app\utils\SeuMiltoDirectionsApi;
use app\utils\SeuMiltoGeocodingApi;
use app\utils\SeuMiltoPlacesApi;
use Exception;

class MapService
{
    public function checkService(): object
    {
        $placeService = new PlaceService();
        $geocodeService = new GeocodingService();
        $directionService = new DirectionService();
        $directionService1 = new DirectionService();

        try {
            $placeService->searchByGeneralConfig("Centro", "-3.7263684626356084,-38.52706632770688");
            $resultPlaceApi = $placeService->getDefaultAPI();
        } catch (Exception $exception) {
            $resultPlaceApi = $exception->getMessage();
        }

        try {
            $geocodeService->searchByGeneralConfig("-3.777033,-38.514835", true, true, true);
            $resultGeocodeApi = $geocodeService->getDefaultAPI();
        } catch (Exception $exception) {
            $resultGeocodeApi = $exception->getMessage();
        }

        try {
            $directionService->getDistanceWithFullAddressGeneralConfig(-3.7330925949285385, -38.55555944450515, -3.722086684782012, -38.54062490485579, true);
            $resultDirectionApi = $directionService->getDefaultAPI();
        } catch (Exception $exception) {
            $resultDirectionApi = $exception->getMessage();
        }

        try {
            $directionService1->getDistanceGeneralConfig(-3.7330925949285385, -38.55555944450515, -3.722086684782012, -38.54062490485579, null, true);
            $resultDirectionEstimateApi = $directionService1->getDefaultAPI();
        } catch (Exception $exception) {
            $resultDirectionEstimateApi = $exception->getMessage();
        }

        return (object)[
            "service_global_active" => Config::get('default_maps_api'),
            "service_place" => $resultPlaceApi,
            "service_geocode" => $resultGeocodeApi,
            "service_direction" => $resultDirectionApi,
            "service_direction_estimate" => $resultDirectionEstimateApi
        ];
    }

    public function listPriority(): object
    {
        return (object)[
            "searching" => json_decode(Config::get('service_priority_searching')),
            "direction" => json_decode(Config::get('service_priority_direction')),
            "geocoding" => json_decode(Config::get('service_priority_geocoding')),
        ];
    }

    public function serviceTest($request, $cityId = null)
    {
        $logDao = new LogDao;
        try {
            $effectiveCityId = $cityId ?? ($request->cityId ?? null);
            $result = $this->getServiceByType($request->type, $effectiveCityId);
            try {
                $result->place->search("Centro", "-3.7263684626356084,-38.52706632770688");
                $place = true;
            } catch (Exception $exception) {
                $logDao->logException($exception);
                $place = $exception->getMessage();
            }


            try {
                $result->direction->getDistanceWithFullAddress(-3.7330925949285385, -38.55555944450515, -3.722086684782012, -38.54062490485579);
                $direction = true;
            } catch (Exception $exception) {
                $logDao->logException($exception);
                $direction = $exception->getMessage();
            }

            try {
                $result->geocoding->search("-3.777033,-38.514835", true);
                $geocoding = true;
            } catch (Exception $exception) {
                $logDao->logException($exception);
                $geocoding = $exception->getMessage();
            }
        } catch (Exception $e) {
            $logDao->logException($e);
            throw $e;
        }

        return (object)[
            'type' => $request->type,
            'place' => $place,
            'direction' => $direction,
            'geocoding' => $geocoding
        ];
    }


    private function returnServiceTest($type, $place, $direction, $geocoding)
    {
        if (is_array($type)) {
            $type = $type[0] ?? 'google';
        }
        return (object)[
            'type' => (string)$type,
            'place' => $place,
            'direction' => $direction,
            'geocoding' => $geocoding
        ];
    }

    public function validateMapServiceKeys(array $mapsServices)
    {
        $validServices = [];

        foreach ($mapsServices as $service) {
            $result = $this->getServiceByType($service);
            $configOk = true;

            if ($service === 'google') {
                $hasGoogleKey = false;
                $candidateKeys = array_merge($result->keys, ['key_google_maps', 'key_google', 'google_api_key_web']);
                foreach ($candidateKeys as $key) {
                    $valueKey = Config::get($key);
                    if (!empty($valueKey) && strlen(trim((string)$valueKey)) > 0) {
                        $hasGoogleKey = true;
                        break;
                    }
                }
                if (!$hasGoogleKey && (!empty(env('GOOGLE_API_KEY')) || !empty(env('GOOGLE_API_KEY_API')))) {
                    $hasGoogleKey = true;
                }
                $configOk = $hasGoogleKey;
            } else {
                foreach ($result->keys as $key) {
                    $valueKey = Config::get($key);
                    if (!isset($valueKey) || strlen($valueKey) === 0) {
                        $configOk = false;
                        break; 
                    }
                }
            }

            if ($configOk) {
                $validServices[] = $service;
            }
        }

        return $validServices;
    }

    public function serviceAllTest()
    {
        $defaultMap = Config::get('default_maps_api') ?: 'google';

        $prioritySearching = json_decode(Config::get('service_priority_searching') ?: '[]', true) ?: [];
        $priorityDirection = json_decode(Config::get('service_priority_direction') ?: '[]', true) ?: [];
        $priorityGeocoding = json_decode(Config::get('service_priority_geocoding') ?: '[]', true) ?: [];

        $activeServices = array_unique(array_filter(array_merge([$defaultMap], $prioritySearching, $priorityDirection, $priorityGeocoding)));
        $mapsServices = $this->validateMapServiceKeys($activeServices);
        if (empty($mapsServices)) {
            $mapsServices = ['google'];
        }

        $logDao = new LogDao;
        $place = true;
        $direction = true;
        $geocoding = true;
        $lastTestedService = is_array($mapsServices) ? ($mapsServices[0] ?? 'google') : $mapsServices;

        try {
            foreach ($mapsServices as $service) {
                $lastTestedService = $service;
                $result = $this->getServiceByType($service);
                try {
                    $result->place->search("Centro", "-3.7263684626356084,-38.52706632770688");
                    $place = true;
                } catch (Exception $exception) {
                    $logDao->logException($exception);
                    $place = $exception->getMessage();
                    return $this->returnServiceTest($service, $place, null, null);
                }

                try {
                    $result->direction->getDistanceWithFullAddress(-3.7330925949285385, -38.55555944450515, -3.722086684782012, -38.54062490485579);
                    $direction = true;
                } catch (Exception $exception) {
                    $logDao->logException($exception);
                    $direction = $exception->getMessage();
                    return $this->returnServiceTest($service, null, $direction, null);
                }

                try {
                    $result->geocoding->search("-3.777033,-38.514835", true);
                    $geocoding = true;
                } catch (Exception $exception) {
                    $logDao->logException($exception);
                    $geocoding = $exception->getMessage();
                    return $this->returnServiceTest($service, null, null, $geocoding);
                }
            }
        } catch (Exception $e) {
            $logDao->logException($e);
            throw $e;
        }

        return $this->returnServiceTest($lastTestedService, $place, $direction, $geocoding);
    }


    private function getServiceByType($type, $cityId = null)
    {
        if (is_array($type)) {
            $type = $type[0] ?? 'google';
        }
        if (is_string($type) && (strpos($type, '[') === 0 || strpos($type, '{') === 0)) {
            $decoded = json_decode($type, true);
            if (is_array($decoded)) {
                $type = $decoded[0] ?? 'google';
            }
        }
        $type = strtolower(trim((string)$type));

        switch ($type) {
            case 'google':
                return (object)[
                    'place'     => new GooglePlacesApi($cityId),
                    'direction' => new GoogleMapsApi($cityId),
                    'geocoding' => new GoogleGeocodingApi($cityId),
                    'keys' => ['google_api_key_backend', 'google_api_key']
                ];
            case 'here':
                return (object)[
                    'place'     => new HerePlacesApi($cityId),
                    'direction' => new HereDistanceApi($cityId),
                    'geocoding' => new HereGeocodingApi($cityId),
                    'keys' => ['here_api_key']
                ];
            case 'mapbox':
                return (object)[
                    'place'     => new MapBoxPlacesApi($cityId),
                    'direction' => new MapBoxApi($cityId),
                    'geocoding' => new MapBoxGeocodingApi($cityId),
                    'keys' => ['mapbox_access_token']
                ];
            case 'seumilto':
                return (object)[
                    'place'     => new SeuMiltoPlacesApi(),
                    'direction' => new SeuMiltoDirectionsApi(),
                    'geocoding' => new SeuMiltoGeocodingApi(),
                    'keys' => ['seumilto_token']
                ];
            default:
                throw new Exception("Erro ao encontrar API Padrão");
        }
    }
}
