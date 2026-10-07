<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/10/2019
 * Time: 08:26
 */

namespace App\Utils\Maps;


use App\Contracts\Maps\PlacesApiContract;
use App\Exceptions\Utils\GoogleException;

class GooglePlacesApi implements PlacesApiContract
{
    private $apiKey;

    private const API_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?";

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
    }

    /**
     * @param $query
     * @param null $proximity_string
     * @return array
     * @throws GoogleException
     */
    public function search($query, $proximity_string = null): array
    {
        $result = $this->request(urlencode($query), $proximity_string);

        $result = json_decode($result);

        $this->resultIsValid($result);

        $predictions = array_map(function($prediction){
            return (object) [
                'address' => $prediction->description,
            ];
        }, $result->predictions);

        return $predictions;
    }

    private function request($query, $proximity_string = null)
    {
        $url_request =
            self::API_URL.'key='.
            $this->apiKey.'&input='.
            $query.'&language=pt-BR&components=country:br';
//            $query.'&language=pt-BR&strictbounds&radius=5000&components=country:br';

        if ($proximity_string)
            $url_request .= "&location=".str_replace(' ', '', trim($proximity_string));

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
     * @throws GoogleException
     */
    private function resultIsValid($result)
    {
        if (!$result)
            throw new GoogleException("Erro na comunicação com o google: " . json_encode($result));

        if (isset($result->error_message))
            throw new GoogleException("Erro google ".now().": {$result->error_message}");

        if ($result->status != "OK")
            throw new GoogleException("Erro google ".now().": {$result->status}");

        return true;
    }
}
