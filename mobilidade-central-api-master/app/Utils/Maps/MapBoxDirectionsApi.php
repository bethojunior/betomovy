<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/05/2020
 * Time: 16:19
 */

namespace App\Utils\Maps;


use App\Contracts\Maps\DirectionsApiContract;
use App\Exceptions\Utils\MapBoxException;

class MapBoxDirectionsApi implements DirectionsApiContract
{
    protected $api_url_directions = "https://api.mapbox.com/directions/v5/mapbox/";
    protected $api_key;
    protected $routing = 'driving';

    private const ROUTING_DRIVING = 'driving';
    private const ROUTING_TRAFFIC = 'driving-traffic';

    public function __construct(string $access_token)
    {
        $this->api_key = $access_token;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param array|null $waypoints
     * @return object
     * @throws MapBoxException
     */
    public function getDistance($start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null)
    {
        $url = $this->getUrlForManyLocations($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints);

        $result = json_decode($this->request($url));

        $this->resultIsValid($result);

        $data = array();
        $data['distance'] = (int)$result->routes[0]->distance;
        $data['duration'] = (int)$result->routes[0]->duration;
        $data['overview_polyline'] = ['points' => $result->routes[0]->geometry];

        return (object)$data;
    }

    private function request($url)
    {
        $ch = curl_init(str_replace(' ', '', $url));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @return \stdClass
     * @throws MapBoxException
     */
    public function getDistanceWithFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude)
    {
        $url = $this->getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude);

        $result = json_decode($this->request($url));

        $this->resultIsValid($result);

        $data = new \stdClass;
        /* Endereço do destino por extenso */
        $data->destination = $result->waypoints[1]->name;
        $data->origin = $result->waypoints[0]->name;

        $route = $result->routes[0];

        $data->distance = (object)[
            'text' => round($route->distance / 1000, 1) . " km",
            'value' => $route->distance,
        ];

        $data->duration = (object)[
            'text' => round($route->duration / 60) . " mins",
            'value' => $route->duration,
        ];

        $data->overview_polyline = ['points' => $route->geometry];

        return $data;
    }

    private function getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude)
    {
        return $this->api_url_directions . self::ROUTING_TRAFFIC."/" .
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
            $wayPoints = implode(';', array_map(function ($destination) {
                if (is_object($destination))
                    $destination = get_object_vars($destination);

                $destination = array_reverse($destination);

                return implode(',', $destination);
            }, $wayPoints));

            $url .= $wayPoints . ";";
        }

        $url .= "{$destination}";

        $url .= "?alternatives=false&geometries=polyline&steps=true&access_token=" . $this->api_key;

        return $url;
    }

    /**
     * @param $result
     * @return bool
     * @throws MapBoxException
     */
    private function resultIsValid($result)
    {
        if (!$result)
            throw new MapBoxException("Erro na comunicação com o mapbox: " . json_encode($result));

        if (!isset($result->routes))
            throw new MapBoxException("Erro MapBox " . now() . ": {$result->message}");

        return true;
    }
}
