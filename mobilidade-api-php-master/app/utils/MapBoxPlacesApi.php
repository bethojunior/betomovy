<?php


namespace app\utils;

use app\contracts\PlacesApiInterface;
use app\dao\MapServiceMetaDataDao;
use app\model\Config;
use app\traits\MapBoxSearchBoxTrait;
use Exception;

class MapBoxPlacesApi implements PlacesApiInterface
{
    use MapBoxSearchBoxTrait;

    private $apiKey;

    private const SUGGEST_URL = "https://api.mapbox.com/search/searchbox/v1/suggest";
    private const TYPE = "mapbox";

    /** Exclui "category" (sugestão de busca por categoria, não é um lugar de verdade). */
    private const TYPES_WITHOUT_CATEGORY = 'country,region,postcode,district,place,locality,neighborhood,street,address,poi';

    private const SESSION_KEY_PREFIX = 'mapbox_places_session';
    private const SESSION_MAX_CALLS = 50;
    private const SESSION_TTL_SECONDS = 180;

    private $keys = [];

    /** Memoizado por instância pra não consumir uma chamada de sessão extra a cada retry de chave. */
    private $sessionToken;

    public function __construct(int $cityId = null)
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
     * @param null $proximity_string
     * @return array
     * @throws Exception
     */
    public function search($query, $proximity_string = null, bool $retry = false): array
    {
        try {
            $this->sessionToken ??= SessionUtils::resolveToken(
                self::SESSION_KEY_PREFIX,
                self::SESSION_MAX_CALLS,
                self::SESSION_TTL_SECONDS
            );

            $suggestions = $this->suggest($query, $proximity_string, $this->sessionToken);

            $suggestions = array_values(array_filter($suggestions, function ($suggestion) {
                return ($suggestion->feature_type ?? null) !== 'category';
            }));

            return array_map(function ($suggestion) {
                return (object)[
                    'address' => $this->buildAddress($suggestion),
                    'latitude' => null,
                    'longitude' => null,
                    'neighborhood' => $suggestion->context->neighborhood->name ?? null,
                    'city' => $suggestion->context->place->name ?? $suggestion->context->locality->name ?? null,
                    'state' => $suggestion->context->region->region_code ?? null,
                    'type' => self::TYPE
                ];
            }, $suggestions);
        } catch (Exception $exception) {
            $this->apiKey = $this->getKey();

            if (is_null($this->apiKey))
                throw $exception;

            return $this->search($query, $proximity_string, true);
        }
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
    private function suggest($query, $proximity_string, string $sessionToken): array
    {
        $url_request =
            self::SUGGEST_URL .
            '?q=' . urlencode($query) .
            '&access_token=' . $this->apiKey .
            '&session_token=' . $sessionToken .
            "&limit=10" .
            "&language=pt" .
            "&types=" . self::TYPES_WITHOUT_CATEGORY .
            $this->buildProximityParam($proximity_string);

        $response = $this->curlGet($url_request);
        $result = json_decode($response);

        if (!$result)
            throw new Exception("Erro na comunicação com o MapBox: {$response}");

        if (!isset($result->suggestions))
            throw new Exception("Erro MapBox " . now() . ": " . ($result->message ?? json_encode($result)));

        return $result->suggestions;
    }

    private function buildProximityParam($proximity_string): string
    {
        if (!$proximity_string)
            return '';

        $position = explode(",", $proximity_string);

        return "&proximity=" . str_replace(' ', '', trim($position[1] . "," . $position[0]));
    }

    public function getApiKey(): string
    {
        return $this->apiKey ?? "";
    }
}
