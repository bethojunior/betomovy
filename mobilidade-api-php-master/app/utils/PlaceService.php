<?php

namespace app\utils;

use app\constant\MapServiceConst;
use app\constant\MapTypeConst;
use app\contracts\PlacesApiInterface;
use app\dao\CityDao;
use app\dao\MapServiceMetaDataDao;
use app\model\Config;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/07/2019
 * Time: 14:11
 */
class PlaceService
{
    private $defaultAPI;
    private $servicesList;
    private $servicesListByCity;
    private $tokenConcat = '';

    public function __construct()
    {
        $this->servicesList = json_decode(Config::get('service_priority_searching'));
        $this->servicesListByCity = json_decode(Config::get('service_priority_searching'));

        $this->servicesList = array_diff($this->servicesList, ['seumilto']);
        $this->servicesListByCity = array_diff($this->servicesListByCity, ['seumilto']);

        $this->getFirstService();
    }

    public function getFirstService()
    {
        if (((bool)Config::get('enable_custom_mode_of_map_services'))) {
            $this->defaultAPI = $this->getNextService();
        } else {
            $this->defaultAPI = Config::get('default_maps_api');
        }
    }

    /**
     * @param $query
     * @param null $proximity_string
     * @param $isFirst
     * @return array
     * @throws Exception
     */
    public function search($query, $proximity_string = null, $isFirst = true)
    {
        if ($proximity_string) {
            $position = explode(",", $proximity_string);
            $city = (new CityDao)->findByCoordinate($position[0], $position[1]);

            if (isset($city->id) && (new MapServiceMetaDataDao)->existKeyByCity($city->id)) {
                $result = $this->searchByCityConfig($query, $proximity_string, $city->id);
                if (count($result) > 0)
                    return $result;
            }
        }

        $this->getFirstService();

        return $this->searchByGeneralConfig($query, $proximity_string, $isFirst);
    }


    /**
     * @param $query
     * @param null $proximity_string
     * @param bool $isFirst
     * @return array
     * @throws Exception
     */
    public function searchByGeneralConfig($query, $proximity_string = null, $isFirst = true)
    {
        if (!$isFirst) {
            $this->defaultAPI = $this->getNextService();
        }

        $defaultApi = $this->choiceDefaultApi();

        $this->removeService($this->defaultAPI);

        try {
            $result = $defaultApi
                ->search($query, $proximity_string);
        } catch (Exception $exception) {

            if (count($this->servicesList) == 0) {
                $service = MapServiceConst::PLACES;
                $this->tokenConcat .= $defaultApi->getApiKey();
                $this->notifyAlert($this->defaultAPI, $service, $defaultApi->getApiKey());
                $this->notifyAlert(MapTypeConst::CRITICAL, $service, $this->tokenConcat);

                throw new Exception("Não foi possível obter um serviço de mapa");
            } else if(!$result) {
                $service = MapServiceConst::PLACES;
                $this->tokenConcat .= $defaultApi->getApiKey();
                $this->notifyAlert($this->defaultAPI, $service, $defaultApi->getApiKey());

                return $this->searchByGeneralConfig($query, $proximity_string, false);
            }
        }

        return $result;
    }

    public function searchByCityConfig($query, $proximity_string = null, $cityId = null, $isFirst = true): array
    {
        if (!$isFirst)
            $this->defaultAPI = $this->getNextServiceByCity();

        $defaultApi = $this->choiceDefaultByCityApi($cityId);

        $this->removeServiceByCity($this->defaultAPI);

        try {
            $result = $defaultApi
                ->search($query, $proximity_string);
        } catch (Exception $exception) {
            if (count($this->servicesListByCity) == 0) {
                return [];
            } else {
                return $this->searchByCityConfig($query, $proximity_string, $cityId, false);
            }
        }

        return $result;
    }

    function notifyAlert($type, $service, $token)
    {
        //exec("nohup php ../console/command.php notify-service-change {$type} {$service} {$token} > /dev/null 2>&1 & echo $! ");
    }

    function removeService($service)
    {
        $newArray = array();

        foreach ($this->servicesList as $type) {
            if ($service != $type) {
                $newArray[] = $type;
            }
        }

        $this->servicesList = $newArray;
    }

    function removeServiceByCity($service)
    {
        $newArray = array();

        foreach ($this->servicesListByCity as $type) {
            if ($service != $type) {
                $newArray[] = $type;
            }
        }

        $this->servicesListByCity = $newArray;
    }

    function getNextService()
    {
        return $this->servicesList[0];
    }


    function getNextServiceByCity()
    {
        return $this->servicesListByCity[0];
    }

    /**
     * @return mixed
     */
    public function getDefaultAPI()
    {
        return $this->defaultAPI;
    }

    /**
     * @return PlacesApiInterface
     * @throws Exception
     */
    private function choiceDefaultApi()
    {
        switch ($this->defaultAPI) {
            case 'google':
                return new GooglePlacesApi;
            case 'here':
                return new HerePlacesApi;
            case 'mapbox':
                return new MapBoxPlacesApi;
            case 'seumilto':
                return new SeuMiltoPlacesApi;
            default:
                throw new Exception("Erro ao encontrar API Padrão");
        }
    }


    /**
     * @param $cityId
     * @return GooglePlacesApi|HerePlacesApi|MapBoxPlacesApi|SeuMiltoPlacesApi
     * @throws Exception
     */
    private function choiceDefaultByCityApi($cityId)
    {
        switch ($this->defaultAPI) {
            case 'google':
                return new GooglePlacesApi($cityId);
            case 'here':
                return new HerePlacesApi($cityId);
            case 'mapbox':
                return new MapBoxPlacesApi($cityId);
            case 'seumilto':
                return new SeuMiltoPlacesApi($cityId);
            default:
                throw new Exception("Erro ao encontrar API Padrão");
        }
    }
}