<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 09:29
 */

namespace App\Utils\Maps;


use App\Contracts\Maps\DirectionsApiContract;
use Exception;
use stdClass;

class GoogleMapsApi implements DirectionsApiContract
{
    protected $api_url_distance_matrix = "https://maps.googleapis.com/maps/api/distancematrix/";
    protected $api_url_directions = "https://maps.googleapis.com/maps/api/directions/";
    protected $api_key;

    public function __construct($google_api_key = null)
    {
        $this->api_key = $google_api_key ?? env("GOOGLE_API_KEY");
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
    public function getDistance($start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null)
    {
        $url = $this->getUrlForManyLocations($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints);

        $result = json_decode($this->request($url));

        $this->resultIsValid($result);

        $legs = $result->routes[0]->legs;

        $data = array();
        $data['distance'] = 0;
        $data['duration'] = 0;
        $data['overview_polyline'] = $result->routes[0]->overview_polyline;

        foreach ($legs as $leg){
            // Distancia em metros
            $data['distance'] += $leg->distance->value;
            // Tempo em segundos
            $data['duration'] += $leg->duration->value;
        }

        return (object) $data;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @return mixed
     * @throws Exception
     */
    public function getDistanceWithFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude)
    {
        $url = $this->getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude);

        $result = json_decode($this->request($url));

        $this->resultIsValid($result);

        $data = new stdClass;
        /* Endereço do destino por extenso */
        $data->destination      = $result->destination_addresses[0];
        $data->origin           = $result->origin_addresses[0];

        $data->distance = $result->rows[0]->elements[0]->distance;
        $data->duration = $result->rows[0]->elements[0]->duration;

        return $data;
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
            throw new Exception("Erro google ".now().": {$result->error_message}");

        if ($result->status != "OK")
            throw new Exception("Erro google ".now().": {$result->status}");

        return true;
    }

    private function request($url)
    {
        $ch = curl_init(str_replace(' ', '', $url));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }

    private function getUrlForManyLocations($start_latitude, $start_longitude, $end_latitude, $end_longitude, array $wayPoints = null)
    {
        $origin = $start_latitude.','.$start_longitude;
        $destination = $end_latitude.','.$end_longitude;

        $url = $this->api_url_directions .
            "json?origin={$origin}&destination={$destination}";

        if (!empty($wayPoints)) {
            $wayPoints = implode('|', array_map(function ($destination){
                return implode(',', (array) $destination);
            }, $wayPoints));

            $url .= "&waypoints={$wayPoints}";
        }

        $url .= "&key=".$this->api_key;

        return $url;
    }

    private function getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude)
    {
        return $this->api_url_distance_matrix .
            "json?origins={$start_latitude},{$start_longitude}&destinations={$end_latitude},{$end_longitude}&key="
            .$this->api_key;
    }
}
