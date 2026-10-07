<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/10/2019
 * Time: 08:33
 */

namespace App\Utils\Maps;


use App\Contracts\Maps\PlacesApiContract;
use Exception;

class HerePlacesApi implements PlacesApiContract
{
    private $api_key;

    private $BASE_URL;

    public function __construct($api_key)
    {
        $this->api_key = $api_key;

        $this->BASE_URL = 'https://autosuggest.search.hereapi.com/v1/autosuggest?';
    }

    public function search($query, $proximity_string = null): array
    {
        $result = $this->request(urlencode($query), $proximity_string);

        $response = json_decode($result);

        if (!isset($response->items)) {
            throw new Exception("Não foi possível encontrar endereços");
        }

        $predictions = array_map(function ($prediction){
            $address = str_replace(['<b>',"</b>"], '',
                ($prediction->highlightedVicinity ?? $prediction->vicinity ?? $prediction->title)
            );

            $address = str_replace(["<br/>"], ' ', $address);

            if ($prediction->title)
                $address = $prediction->title . ', ' . $address;

            return (object) [
                'address' => $address,
                'latitude' => $prediction->position->lat ?? null,
                'longitude' => $prediction->position->lng ?? null,
            ];
        }, $response->items);

        return $predictions;
    }

    public function request($query, $proximity_string = null)
    {
        $url_request =
            $this->BASE_URL .
            'apiKey=' . $this->api_key .
            '&at=' . $proximity_string .
            '&lang=pt-BR' .
            '&q=' . $query;

        $ch = curl_init(str_replace(
            ' ', '', $url_request));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }
}
