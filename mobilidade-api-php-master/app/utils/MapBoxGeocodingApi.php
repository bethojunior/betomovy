<?php


namespace app\utils;

use app\contracts\GeocodingInterface;
use app\dao\MapServiceMetaDataDao;
use app\model\Config;
use app\model\Geocoder;
use app\traits\MapBoxSearchBoxTrait;
use Exception;

class MapBoxGeocodingApi implements GeocodingInterface
{
    use MapBoxSearchBoxTrait;

    private $apiKey;

    private const FORWARD_URL = "https://api.mapbox.com/search/searchbox/v1/forward";
    private const REVERSE_URL = "https://api.mapbox.com/search/searchbox/v1/reverse";
    private const TYPE = "mapbox";

    /** Exclui "category" (sugestão de busca por categoria, não é um lugar de verdade). */
    private const TYPES_WITHOUT_CATEGORY = 'country,region,postcode,district,place,locality,neighborhood,street,address,poi';

    private $keys = [];

    public function __construct($cityId = null)
    {
        if ($cityId) {
            $this->keys = $this->getKeyByCity('mapbox_access_token', $cityId);
        } else {
            $this->keys[] = Config::get('mapbox_access_token', null, true);
        }

        $this->apiKey = $this->getKey();
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
        return $this->apiKey;
    }


    /**
     * @param $query
     * @param false $isCoordinate
     * @param bool $retry
     * @return Geocoder
     * @throws Exception
     */
    public function search($query, $isCoordinate = false, bool $retry = false): Geocoder
    {
        try {
            $features = $this->request($query, $isCoordinate);

            $feature = $this->firstRealFeature($features);

            $geocoder = new Geocoder;

            $this->feedAddress($geocoder, $feature->properties->context ?? null);

            $geocoder
                ->setStreet($feature->properties->name ?? null)
                ->setAddress($this->buildAddress($feature->properties))
                ->setLatitude($feature->geometry->coordinates[1])
                ->setLongitude($feature->geometry->coordinates[0])
                ->setType(self::TYPE);

            return $geocoder;
        } catch (Exception $exception) {
            $this->apiKey = $this->getKey();

            if (is_null($this->apiKey))
                throw $exception;

            return $this->search($query, $isCoordinate, true);
        }
    }

    /**
     * O Mapbox pode devolver uma feature "category" (sugestão de busca por categoria,
     * sem endereço de verdade) na primeira posição. Pula esses casos e pega o primeiro
     * resultado que é um lugar real.
     *
     * @throws Exception
     */
    private function firstRealFeature(array $features)
    {
        foreach ($features as $feature) {
            if (($feature->properties->feature_type ?? null) !== 'category')
                return $feature;
        }

        throw new Exception("Endereço não encontrado");
    }

    private function feedAddress(Geocoder &$geocoder, $context)
    {
        if (!$context)
            return;

        if (isset($context->neighborhood))
            $geocoder->setNeighborhood($context->neighborhood->name);

        if (isset($context->place))
            $geocoder->setCity($context->place->name);
        elseif (isset($context->locality))
            $geocoder->setCity($context->locality->name);

        if (isset($context->region))
            $geocoder->setEstate($context->region->region_code ?? null);

        if (isset($context->country))
            $geocoder->setCountry($context->country->name);

        if (isset($context->postcode))
            $geocoder->setPostalCode($context->postcode->name);
    }

    private function getKey()
    {
        if (count($this->keys) > 0)
            return array_splice($this->keys, 0, 1)[0];

        return null;
    }

    /**
     * @throws Exception
     */
    private function request($query, $isCoordinate = false): array
    {
        if ($isCoordinate) {
            $position = explode(",", $query);

            if (count($position) !== 2)
                throw new Exception("Coordenada inválida para geocoding reverso: {$query}");

            $url_request = self::REVERSE_URL .
                "?latitude=" . urlencode(trim($position[0])) .
                "&longitude=" . urlencode(trim($position[1])) .
                "&limit=1";
        } else {
            $url_request = self::FORWARD_URL . "?q=" . urlencode($query) . "&limit=1";
        }

        $url_request .= "&types=" . self::TYPES_WITHOUT_CATEGORY;
        $url_request .= "&access_token=" . $this->apiKey;

        $response = $this->curlGet($url_request);
        $result = json_decode($response);

        if (!$result)
            throw new Exception("Erro na comunicação com o MapBox: {$response}");

        if (!isset($result->features))
            throw new Exception("Erro MapBox " . now() . ": " . ($result->message ?? json_encode($result)));

        if (empty($result->features))
            throw new Exception("Endereço não encontrado");

        return $result->features;
    }

    public function getApiKey(): string
    {
        return $this->apiKey ?? "";
    }
}
