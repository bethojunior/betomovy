<?php

namespace app\utils;

use app\contracts\DirectionsApiInterface;
use app\dao\MapServiceMetaDataDao;
use app\model\Config;
use app\traits\WaypointCoordTrait;
use Exception;
use stdClass;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 16/07/2018
 * Time: 14:10
 */
class GoogleMapsApi implements DirectionsApiInterface
{
    use WaypointCoordTrait;
    protected $api_url_distance_matrix = "https://maps.googleapis.com/maps/api/distancematrix/";
    protected $api_url_directions = "https://maps.googleapis.com/maps/api/directions/";
    protected $api_key;
    private const TYPE = "google";
    private $keys = [];

    public function __construct($cityId = null)
    {
        $keys = [];
        if ($cityId) {
            $cityKeysBackend = $this->getKeyByCity('google_api_key_backend', $cityId);
            $cityKeys = $this->getKeyByCity('google_api_key', $cityId);
            $keys = array_merge($keys, is_array($cityKeysBackend) ? $cityKeysBackend : [], is_array($cityKeys) ? $cityKeys : []);
        }

        $globalCandidates = [
            'AIzaSyDWAMSuOr80f8wW7y6vFglqRKz4dKq6Y4I',
            Config::get('google_api_key_backend', null, true),
            Config::get('google_api_key', null, true),
            Config::get('key_google_maps', null, true),
            Config::get('key_google', null, true),
            Config::get('google_api_key_web', null, true),
            env('GOOGLE_API_KEY_API'),
            env('GOOGLE_API_KEY'),
        ];

        foreach ($globalCandidates as $cand) {
            if (!empty($cand) && is_string($cand) && trim($cand) !== '') {
                $cand = trim($cand);
                if (!in_array($cand, $keys)) {
                    $keys[] = $cand;
                }
            }
        }

        $this->keys = $keys;
        $this->api_key = $this->getKey();
    }

    /**
     * @param $key
     * @param $cityId
     * @return false
     */
    private function getKeyByCity($key, $cityId)
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
        $optimization = Config::get('route_optimization_google', null, true);

        $routeIndex = 0;
        $valueAux = null;
        $valueType = $optimization == 'time' ? "duration" : "distance";

        foreach ($routes as $index => $route) {
            $calculate = 0;
            foreach ($route->legs as $leg) {
                $calculate += $leg->$valueType->value;
            }

            if (!$valueAux || $valueAux > $calculate) {
                $valueAux = $calculate;
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
     * @return stdClass
     * @throws Exception
     */
    public function getDistance($start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null, bool $retry = false)
    {
        if (empty($this->api_key)) {
            throw new Exception("GoogleMapsApi: API key não configurada");
        }

        try {
            $url = $this->getUrlForManyLocations($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints);

            $result = json_decode($this->request($url));

            $this->resultIsValid($result);

            $routeIndex = $this->getIndexRouteOptimizationByConfig($result->routes);

            $legs = $result->routes[$routeIndex]->legs;

            $data = array();
            $data['distance'] = 0;
            $data['duration'] = 0;
            $data['overview_polyline'] = $result->routes[$routeIndex]->overview_polyline;
            $data['type'] = self::TYPE;

            foreach ($legs as $leg) {
                // Distancia em metros
                $data['distance'] += $leg->distance->value;
                // Tempo em segundos
                $data['duration'] += $leg->duration->value;
            }

            return (object)$data;
        } catch (Exception $exception) {
            // Se a Directions API legada falhar (ex: LegacyApiNotActivatedMapError), tenta a nova Routes API
            try {
                $routeRes = $this->requestRoutesApi($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints);
                if ($routeRes) {
                    return $routeRes;
                }
            } catch (Exception $routesEx) {
                // Falhou na Routes API também, tenta próxima chave
            }

            $this->api_key = $this->getKey();

            if (is_null($this->api_key)) {
                throw $exception;
            }

            return $this->getDistance($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints, true);
        }
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param bool $retry
     * @return mixed
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
            $data->destination = $result->destination_addresses[0];
            $data->origin = $result->origin_addresses[0];

            $data->distance = $result->rows[0]->elements[0]->distance;
            $data->duration = $result->rows[0]->elements[0]->duration;

            return $data;
        } catch (Exception $exception) {
            // Se a Distance Matrix API legada falhar, tenta a nova Routes API
            try {
                $routeRes = $this->requestRoutesApi($start_latitude, $start_longitude, $end_latitude, $end_longitude);
                if ($routeRes) {
                    $data = new stdClass;
                    $data->destination = '';
                    $data->origin = '';
                    $data->distance = (object)[
                        'value' => $routeRes->distance,
                        'text' => round($routeRes->distance / 1000, 1) . ' km'
                    ];
                    $data->duration = (object)[
                        'value' => $routeRes->duration,
                        'text' => round($routeRes->duration / 60) . ' mins'
                    ];
                    return $data;
                }
            } catch (Exception $routesEx) {
            }

            $this->api_key = $this->getKey();

            if (is_null($this->api_key))
                throw $exception;

            return $this->getDistanceWithFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude, true);
        }
    }

    /**
     * @param $result
     * @return bool
     * @throws Exception
     */
    private function resultIsValid($result)
    {
        if (!$result)
            throw new Exception("Erro na comunicação com o google: " . json_encode($result));

        if (isset($result->error_message))
            throw new Exception("Erro google " . now() . ": {$result->error_message}");

        if ($result->status != "OK")
            throw new Exception("Erro google " . now() . ": {$result->status}");

        return true;
    }

    private function request($url)
    {
        $ch = curl_init(str_replace(' ', '', $url));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }

    private function getUrlForManyLocations($start_latitude, $start_longitude, $end_latitude, $end_longitude, array $wayPoints = null)
    {
        $origin = $start_latitude . ',' . $start_longitude;
        $destination = $end_latitude . ',' . $end_longitude;

        $url = $this->api_url_directions .
            "json?origin={$origin}&destination={$destination}&alternatives=true";

        if (!empty($wayPoints)) {
            $url .= "&waypoints=" . implode('|', array_map(
                fn($wp) => $this->waypointToCoord($wp),
                $wayPoints
            ));
        }

        $url .= "&key=" . $this->api_key;

        return $url;
    }

    private function getKey()
    {
        if (count($this->keys) > 0) {
            return array_splice($this->keys, 0, 1)[0];
        }

        return null;
    }

    private function getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude)
    {
        return $this->api_url_distance_matrix .
            "json?origins={$start_latitude},{$start_longitude}&destinations={$end_latitude},{$end_longitude}&key="
            . $this->api_key;
    }

    private function requestRoutesApi($start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null)
    {
        $payload = [
            'origin' => [
                'location' => [
                    'latLng' => [
                        'latitude' => (float)$start_latitude,
                        'longitude' => (float)$start_longitude
                    ]
                ]
            ],
            'destination' => [
                'location' => [
                    'latLng' => [
                        'latitude' => (float)$end_latitude,
                        'longitude' => (float)$end_longitude
                    ]
                ]
            ],
            'travelMode' => 'DRIVE'
        ];

        if (!empty($waypoints)) {
            $intermediates = [];
            foreach ($waypoints as $wp) {
                $wpLat = is_array($wp) ? ($wp['latitude'] ?? null) : ($wp->latitude ?? null);
                $wpLng = is_array($wp) ? ($wp['longitude'] ?? null) : ($wp->longitude ?? null);
                if ($wpLat !== null && $wpLng !== null) {
                    $intermediates[] = [
                        'location' => [
                            'latLng' => [
                                'latitude' => (float)$wpLat,
                                'longitude' => (float)$wpLng
                            ]
                        ]
                    ];
                }
            }
            if (!empty($intermediates)) {
                $payload['intermediates'] = $intermediates;
            }
        }

        $ch = curl_init('https://routes.googleapis.com/directions/v2:computeRoutes');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'X-Goog-Api-Key: ' . $this->api_key,
            'X-Goog-FieldMask: routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
        ]);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            throw new Exception("Erro cURL Routes API: {$curlError}");
        }

        $result = json_decode($response);
        if (!$result || empty($result->routes)) {
            $msg = $result->error->message ?? 'Nenhuma rota retornada pela Routes API';
            throw new Exception("Erro Routes API: {$msg}");
        }

        $route = $result->routes[0];
        $distance = $route->distanceMeters ?? 0;
        $durationStr = $route->duration ?? '0s';
        $duration = (int)rtrim($durationStr, 's');
        $polyline = $route->polyline->encodedPolyline ?? '';

        return (object)[
            'distance' => (int)$distance,
            'duration' => (int)$duration,
            'overview_polyline' => (object)['points' => $polyline],
            'type' => self::TYPE
        ];
    }

    /**
     * @param null $api_key
     * @return GoogleMapsApi
     */
    public function setApiKey($api_key)
    {
        $this->api_key = $api_key;
        return $this;
    }

    public function getApiKey(): string
    {
        return $this->api_key ?? "";
    }
}