<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/10/2019
 * Time: 08:28
 */

namespace App\Helpers\Maps;


use App\Contracts\Maps\PlacesApiContract;
use App\Exceptions\Helper\PlaceHelperException;
use App\Helpers\Config\ConfigHelper;
use App\Utils\Maps\GooglePlacesApi;
use App\Utils\Maps\HerePlacesApi;
use App\Utils\Maps\MapBoxPlacesApi;

class PlaceHelper
{
    /**
     * @var ConfigHelper
     */
    private $configHelper;

    private $defaultAPI;

    public function __construct(ConfigHelper $configHelper)
    {
        $this->configHelper = $configHelper;

        $this->defaultAPI = $configHelper->get('default_maps_api');
    }

    /**
     * @param $query
     * @param null $proximity_string
     * @return array
     * @throws PlaceHelperException
     */
    public function search($query, $proximity_string = null)
    {
        $defaultApi = $this->choiceDefaultApi();

        return $defaultApi
            ->search($query, $proximity_string);
    }

    /**
     * @return PlacesApiContract
     * @throws PlaceHelperException
     */
    private function choiceDefaultApi()
    {
        switch ($this->defaultAPI) {
            case 'google':
                return new GooglePlacesApi($this->configHelper->get('google_api_key_backend'));
            case 'here':
                $config = $this->configHelper
                    ->get('here_api_key');

                return new HerePlacesApi($config);
            case 'mapbox':
                $config = $this->configHelper
                    ->get('mapbox_access_token');

                return new MapBoxPlacesApi($config);
            default:
                throw new PlaceHelperException("Erro ao encontrar API Padrão");
        }
    }
}
