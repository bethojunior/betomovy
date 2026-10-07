<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/05/2020
 * Time: 16:11
 */

namespace App\Utils\Maps;


use App\Contracts\Maps\PlacesApiContract;
use App\Exceptions\Utils\MapBoxException;

class MapBoxPlacesApi implements PlacesApiContract
{
    private $apiKey;

    private const API_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places/";

    public function __construct(string $access_token)
    {
        $this->apiKey = $access_token;
    }

    /**
     * @param $query
     * @param null $proximity_string
     * @return array
     * @throws MapBoxException
     */
    public function search($query, $proximity_string = null): array
    {
        $result = $this->request($query, $proximity_string);

        $result = json_decode($result);

        $this->resultIsValid($result);

        $predictions = array_map(function ($prediction) {
            $neighborhood = '';

            if (isset($prediction->context)) {
                $result = array_filter($prediction->context, function ($item) {
                    return strpos($item->id, "neighborhood") !== false;
                });

                if (isset($result[0])) {
                    $result = $result[0];
                    if (isset($result->text))
                        $neighborhood = $result->text;
                }
            }


            return (object)[
                'address' => $prediction->place_name,
                'latitude' => $prediction->center[1],
                'longitude' => $prediction->center[0],
                'neighborhood' => $neighborhood
            ];
        }, $result->features);

        return $predictions;
    }

    private function request($query, $proximity_string = null)
    {
        $url_request =
            self::API_URL . urlencode($query) . '.json?access_token=' . $this->apiKey . "&limit=10";

        if ($proximity_string) {
            $position = explode(",", $proximity_string);
            $url_request .= "&proximity=" . str_replace(' ', '', trim($position[1] . "," . $position[0]));
        }

        $ch = curl_init(str_replace(
            ' ', '', $url_request));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }

    /**
     * @param $result
     * @return bool
     * @throws MapBoxException
     */
    private function resultIsValid($result)
    {
        if (!$result)
            throw new MapBoxException("Erro na comunicação com o MapBox: " . json_encode($result));

        if (!isset($result->features))
            throw new MapBoxException("Erro MapBox " . now() . ": {$result->message}");

        return true;
    }
}
