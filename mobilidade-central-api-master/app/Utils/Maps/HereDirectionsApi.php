<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/03/2020
 * Time: 14:40
 */

namespace App\Utils\Maps;


use App\Contracts\Maps\DirectionsApiContract;
use App\Utils\FlexiblePolyline;
use App\Utils\Polyline;
use Exception;
use stdClass;

class HereDirectionsApi implements DirectionsApiContract
{
    private $app_id;
    private $app_code;
    private $api_key;

    private $BASE_URL;

    private const TYPE = "here";

    public function __construct($api_key)
    {
        $this->api_key = $api_key;

        $this->BASE_URL = 'https://router.hereapi.com/v8/routes?';
    }

    private function getIndexRouteOptimizationByConfig($routes)
    {
//        $optimization = Config::get('route_optimization_here');

        $routeIndex = 0;
        $valueAux = null;
        $valueType = "duration";
//        $valueType = $optimization == 'time' ? "duration" : "length";

        foreach ($routes as $index => $route) {
            if (!$valueAux || $valueAux > $route[$valueType]) {
                $valueAux = $route[$valueType];
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
     * @return object
     * @throws Exception
     */
    public function getDistance(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null)
    {
        $url = $this
            ->getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints);

        $result = json_decode($this->request($url));

        $this->responseIsValid($result);

        $routeSummaries = [];
        foreach ($result->routes as $route) {
            $duration = 0;
            $length = 0;
            $routePolyline = [];
            foreach ($route->sections as $section) {
                $duration += $section->summary->duration;
                $length += $section->summary->length;

//                    $polyline = FlexiblePolyline::decode($section->polyline);
                $routePolyline[] = $section->polyline;
            }

            $routeSummaries[] = [
                'duration' => $duration,
                'length' => $length,
                'polyline' => $routePolyline
            ];
        }

        $routeIndex = $this->getIndexRouteOptimizationByConfig($routeSummaries);
        $route = $routeSummaries[$routeIndex];

        $data = array();
        $data['distance'] = $route['length'];
        $data['duration'] = $route['duration'];
        $data['overview_polyline'] = $this->getOverviewPolyLine($route['polyline']);
        $data['type'] = self::TYPE;

        return (object)$data;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @return stdClass
     * @throws Exception
     */
    public function getDistanceWithFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude)
    {
        $url = $this->getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude);

        $result = json_decode($this->request($url));

        $this->responseIsValid($result);

        $route = $result->routes[0]->sections[0];

        $origin = '';
        foreach ($route->spans as $span) {
            if (!isset($span->names)) {
                continue;
            }

            $origin = $span->names[0]->value;
            break;
        }

        $destination = end($route->spans);

        $data = new stdClass;
        /* Endereço do destino por extenso */
        $data->destination = $destination->names[0]->value;
        $data->origin = $origin;

        $data->distance = (object)[
            'text' => round($route->summary->length / 1000, 1) . " km",
            'value' => $route->summary->length,
        ];
        $data->duration = (object)[
            'text' => round($route->summary->duration / 60) . " mins",
            'value' => $route->summary->duration,
        ];

        $data->overview_polyline = $this->getOverviewPolyLine([$route->polyline]);

        return $data;
    }

    public function request($url)
    {
        $ch = curl_init(str_replace(
            ' ', '', $url));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }

    /**
     * @param $result
     * @throws Exception
     */
    private function responseIsValid($result)
    {
        if (!isset($result))
            throw new Exception("Erro de comunicação com a API: ". json_encode($result));

        if (!isset($result->routes))
            throw new Exception("Erro here API ".now());
    }

    private function getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null)
    {
        $url = $this->BASE_URL .
            "transportMode=car" . "&" .
            "origin=" . $start_latitude . "," . $start_longitude . "&" .
            "destination=" . $end_latitude . "," . $end_longitude . "&" .
            "return=polyline,summary" . "&" .
            "spans=names" . "&" .
            "lang=pt-BR" . "&" .
            "apiKey=" . $this->api_key;

        if ($waypoints) {
            foreach ($waypoints as $waypoint) {
                $url .= "&via=" . $waypoint->latitude . "," . $waypoint->longitude;
            }
        }

        $url .= "&mode=fastest;car;traffic:enabled&language=pt-br";

        return $url;
    }

    private function getOverviewPolyLine($flexiblePolyline)
    {
        $points = [];

        foreach ($flexiblePolyline as $polyline) {
            $flexiblePolylineArray = FlexiblePolyline::decode($polyline);

            if (end($flexiblePolyline) != $polyline) {
                array_pop($flexiblePolylineArray['polyline']);
            }

            foreach ($flexiblePolylineArray['polyline'] as $point) {
                $points[] = [$point[0], $point[1]];
            }
        }

        return (object)['points' => Polyline::encode($points)];
    }
}
