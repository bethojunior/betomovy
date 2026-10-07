<?php


namespace app\utils;

use app\contracts\DirectionsApiInterface;
use app\dao\MapServiceMetaDataDao;
use app\model\Config;
use app\traits\WaypointCoordTrait;
use Exception;
use stdClass;

class MapBoxApi implements DirectionsApiInterface
{
    use WaypointCoordTrait;
    protected $api_url_directions = "https://api.mapbox.com/directions/v5/mapbox/";
    protected $api_key;
    protected $routing = 'driving';

    private const ROUTING_DRIVING = 'driving';
    private const ROUTING_TRAFFIC = 'driving-traffic';
    private const TYPE = "mapbox";

    private $keys = [];

    public function __construct($cityId = null)
    {
        if ($cityId) {
            $this->keys = $this->getKeyByCity('mapbox_access_token', $cityId);
        } else {
            $this->keys[] = Config::get('mapbox_access_token', null, true);
        }

        $this->api_key = $this->getKey();
    }


    /**
     * @param $key
     * @param $cityId
     * @return false
     */
    public function getKeyByCity($key, $cityId)
    {
        $results = (new MapServiceMetaDataDao)->findByCity($key, $cityId);

        return array_map(function ($item) {
            return $item->value;
        }, $results);
    }

    public function isValidKey()
    {
        return $this->api_key;
    }

    private function getIndexRouteOptimizationByConfig($routes)
    {
        $optimization = Config::get('route_optimization_mapbox', null, true);

        $routeIndex = 0;
        $valueAux = null;
        $valueType = $optimization == 'time' ? "duration" : "distance";

        foreach ($routes as $index => $route) {
            if (!$valueAux || $valueAux > (int)$route->$valueType) {
                $valueAux = (int)$route->$valueType;
                $routeIndex = $index;
            }
        }

        return $routeIndex;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param array|null $waypoints
     * @param bool $retry
     * @return object
     * @throws Exception
     */
    public function getDistance($start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null, bool $retry = false)
    {
        if (empty($this->api_key)) {
            throw new Exception("MapBoxApi: API key não configurada");
        }

        try {
            $url = $this->getUrlForManyLocations($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints);

            $result = json_decode($this->request($url));

            $this->resultIsValid($result);

            $routeIndex = $this->getIndexRouteOptimizationByConfig($result->routes);

            $route = $result->routes[$routeIndex];

            $data = array();
            $data['distance'] = (int)$route->distance;
            $data['duration'] = (int)$route->duration;
            $data['overview_polyline'] = (object)['points' => $route->geometry];
            $data['type'] = self::TYPE;

            return (object)$data;
        } catch (Exception $exception) {
            $this->api_key = $this->getKey();

            if (is_null($this->api_key))
                throw $exception;

            return $this->getDistance($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints, true);
        }
    }

    private function request($url)
    {
        $ch = curl_init(str_replace(' ', '', $url));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            throw new Exception("Erro cURL MapBox: {$curlError}");
        }

        return $response;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param bool $retry
     * @return stdClass
     * @throws Exception
     */
    public function getDistanceWithFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude, bool $retry = false)
    {
        try {

            $url = $this->getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude);

            $result = json_decode($this->request($url));

            $this->resultIsValid($result);

            $data = new stdClass;
            /* Endereço do destino por extenso */
            $data->destination = $result->waypoints[1]->name;
            $data->origin = $result->waypoints[0]->name;

            $route = $result->routes[0];

            $mapUtils = new MapUtils();

            $data->distance = (object)[
                'text' => $mapUtils->formatDistanceText($route->distance),
                'value' => $route->distance,
            ];

            $data->duration = (object)[
                'text' => $mapUtils->formatDurationText($route->duration),
                'value' => $route->duration,
            ];

            $data->overview_polyline = (object)['points' => $route->geometry];

            return $data;
        } catch (Exception $exception) {
            $this->api_key = $this->getKey();

            if (is_null($this->api_key))
                throw $exception;

            return $this->getDistanceWithFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude, true);
        }
    }

    private function getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude)
    {
        return $this->api_url_directions . self::ROUTING_TRAFFIC . "/" .
            "{$start_longitude},{$start_latitude};{$end_longitude},{$end_latitude}?access_token="
            . $this->api_key;
    }


    private function getUrlForManyLocations($start_latitude, $start_longitude, $end_latitude, $end_longitude, ?array $wayPoints = null)
    {
        $routing = empty($wayPoints) ? self::ROUTING_TRAFFIC : self::ROUTING_DRIVING;
        $origin = $start_longitude . ',' . $start_latitude;
        $destination = $end_longitude . ',' . $end_latitude;

        $url = $this->api_url_directions . "{$routing}/" . "{$origin};";

        if (!empty($wayPoints)) {
            $url .= implode(';', array_map(
                fn($wp) => $this->waypointToCoord($wp, 'lng,lat'),
                $wayPoints
            )) . ";";
        }

        $url .= "{$destination}";

        $url .= "?alternatives=true&geometries=polyline&steps=true&access_token=" . $this->api_key;

        return $url;
    }

    private function getKey()
    {
        if (count($this->keys) > 0)
            return array_splice($this->keys, 0, 1)[0];

        return null;
    }

    /**
     * @param $result
     * @return bool
     * @throws Exception
     */
    private function resultIsValid($result)
    {
        if (!$result)
            throw new Exception("Erro na comunicação com o mapbox: " . json_encode($result));

        if (!isset($result->routes))
            throw new Exception("Erro MapBox " . now() . ": {$result->message}");

        return true;
    }

    public function getApiKey(): string
    {
        return $this->api_key ?? "";
    }
}