<?php

namespace app\utils;

use app\constant\MapServiceConst;
use app\constant\MapTypeConst;
use app\dao\CityDao;
use app\model\Config;
use app\model\Geocoder;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/10/2019
 * Time: 09:17
 */
class GeocodingService
{
    private $defaultAPI;
    private $servicesList;
    private $servicesListByCity;
    private $tokenConcat = '';

    private function loadKeys()
    {
        $this->servicesList = json_decode(Config::get('service_priority_geocoding'));
        $this->servicesListByCity = json_decode(Config::get('service_priority_geocoding'));

        $this->getFirstService();
    }

    private function getFirstService()
    {
        if (((bool)Config::get('enable_custom_mode_of_map_services'))) {
            $this->defaultAPI = $this->getNextService();
        } else {
            $this->defaultAPI = Config::get('default_maps_api');
        }
    }

    /**
     * @param $query
     * @param bool $isCoordinate
     * @param $isFirst
     * @return Geocoder
     * @throws Exception
     */
    public function search($query, bool $isCoordinate = false, bool $isFirst = true)
    {
        $this->loadKeys();

        if ($query && $isCoordinate) {
            $position = explode(",", $query);
            $city = (new CityDao)->findByCoordinate($position[0], $position[1]);

            if ($city) {
                $result = $this->searchByCityConfig($query, $isCoordinate, $city->id, $isFirst);

                if ($result) {
                    return $result;
                }
            }
        }
        $this->getFirstService();
        return $this->searchByGeneralConfig($query, $isCoordinate, $isFirst);
    }

    /**
     * @param $query
     * @param false $isCoordinate
     * @param bool $isFirst
     * @return Geocoder
     * @throws Exception
     */
    public function searchByGeneralConfig(
        $query,
        bool $isCoordinate = false,
        bool $isFirst = true,
        bool $calledByOtherClass = false
    )
    {
        if ($calledByOtherClass === true) {
            $this->loadKeys();
        }

        if (!$isFirst) {
            $this->defaultAPI = $this->getNextService();
        }

        $defaultApi = $this->choiceDefaultApi();

        $this->removeService($this->defaultAPI);

        try {
            $result = $defaultApi
                ->search($query, $isCoordinate);
        } catch (Exception $exception) {
            if (count($this->servicesList) == 0) {
                $service = MapServiceConst::GEOCODING;
                $this->tokenConcat .= $defaultApi->getApiKey();
                $this->notifyAlert($this->defaultAPI, $service, $defaultApi->getApiKey());
                $this->notifyAlert(MapTypeConst::CRITICAL, $service, $this->tokenConcat);

                throw new Exception("Não foi possível obter um serviço de mapa");
            } else {
                $service = MapServiceConst::GEOCODING;
                $this->tokenConcat .= $defaultApi->getApiKey();
                $this->notifyAlert($this->defaultAPI, $service, $defaultApi->getApiKey());

                return $this->searchByGeneralConfig($query, $isCoordinate, false);
            }
        }

        return $result;
    }

    /**
     * @param $query
     * @param false $isCoordinate
     * @param $cityId
     * @param bool $isFirst
     * @return Geocoder
     * @throws Exception
     */
    private function searchByCityConfig($query, $isCoordinate = false, $cityId, $isFirst = true)
    {
        if (!$isFirst) {
            $this->defaultAPI = $this->getNextServiceByCity();
        }

        $defaultApi = $this->choiceDefaultByCityApi($cityId);

        $this->removeServiceByCty($this->defaultAPI);

        try {
            $result = $defaultApi
                ->search($query, $isCoordinate);
        } catch (Exception $exception) {
            if (count($this->servicesListByCity) == 0) {
                return null;
            } else {
                return $this->searchByCityConfig($query, $isCoordinate, $cityId, false);
            }
        }

        return $result;
    }


    private function notifyAlert($type, $service, $token)
    {
        // exec("nohup php ../console/command.php notify-service-change {$type} {$service} {$token} > /dev/null 2>&1 & echo $! ");
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

    private function getNextService()
    {
        return $this->servicesList[0];
    }

    /**
     * @return mixed
     */
    public function getDefaultAPI()
    {
        return $this->defaultAPI;
    }

    private function removeServiceByCty($service)
    {
        $newArray = array();

        foreach ($this->servicesListByCity as $type) {
            if ($service != $type) {
                $newArray[] = $type;
            }
        }

        $this->servicesListByCity = $newArray;
    }


    private function getNextServiceByCity()
    {
        return $this->servicesListByCity[0];
    }


    /**
     * @return \app\contracts\GeocodingInterface
     * @throws Exception
     */
    private function choiceDefaultApi()
    {
        switch ($this->defaultAPI) {
            case 'google':
                return new GoogleGeocodingApi;
            case 'here':
                return new HereGeocodingApi;
            case 'mapbox':
                return new MapBoxGeocodingApi;
            case 'seumilto':
                return new SeuMiltoGeocodingApi;
            default:
                throw new Exception("Erro ao encontrar API Padrão");
        }
    }

    /**
     * @param $cityId
     * @return GoogleGeocodingApi|HereGeocodingApi|MapBoxGeocodingApi|SeuMiltoGeocodingApi
     * @throws Exception
     */
    private function choiceDefaultByCityApi($cityId)
    {
        switch ($this->defaultAPI) {
            case 'google':
                return new GoogleGeocodingApi($cityId);
            case 'here':
                return new HereGeocodingApi($cityId);
            case 'mapbox':
                return new MapBoxGeocodingApi($cityId);
            case 'seumilto':
                return new SeuMiltoGeocodingApi();
            default:
                throw new Exception("Erro ao encontrar API Padrão");
        }
    }
}