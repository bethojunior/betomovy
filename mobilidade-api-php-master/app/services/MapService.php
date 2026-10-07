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

    public function serviceTest($request)
    {
        $logDao = new LogDao;
        try {
            $result = $this->getServiceByType($request->type);
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
        return (object)[
            'type' => is_array($type) ? json_encode($type) : $type,
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

            foreach ($result->keys as $key) {
                $valueKey = Config::get($key);
                if (!isset($valueKey) || strlen($valueKey) === 0) {
                    $configOk = false;
                    break; 
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
        $typeServices = ['google', 'here', 'mapbox', 'seumilto'];
        $mapsServices = $this->validateMapServiceKeys($typeServices);

        $logDao = new LogDao;
        try {
            foreach ($mapsServices as $service) {
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

        return $this->returnServiceTest($mapsServices, $place, $direction, $geocoding);
    }


    private function getServiceByType($type)
    {
        switch ($type) {
            case 'google':
                return (object)[
                    'place'     => new GooglePlacesApi(),
                    'direction' => new GoogleMapsApi(),
                    'geocoding' => new GoogleGeocodingApi(),
                    'keys' => ['google_api_key_backend', 'google_api_key']
                ];
            case 'here':
                return (object)[
                    'place'     => new HerePlacesApi(),
                    'direction' => new HereDistanceApi(),
                    'geocoding' => new HereGeocodingApi(),
                    'keys' => ['here_api_key']
                ];
            case 'mapbox':
                return (object)[
                    'place'     => new MapBoxPlacesApi(),
                    'direction' => new MapBoxApi(),
                    'geocoding' => new MapBoxGeocodingApi(),
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
