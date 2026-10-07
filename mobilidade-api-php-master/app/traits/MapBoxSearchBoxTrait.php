<?php

namespace app\traits;

use Exception;

trait MapBoxSearchBoxTrait
{
    /**
     * Monta o texto do resultado: POI ganha "{nome} - {endereço completo}" (precisa do
     * nome, já que o endereço completo sozinho não identifica o lugar — "Rua X, 123" não
     * diz que ali é a "Prefeitura Municipal"); os demais tipos (rua, bairro, cidade...)
     * usam só o endereço completo, sem duplicar o nome (que já é o início dele).
     */
    private function buildAddress($properties): string
    {
        $name = $properties->name ?? '';
        $context = $properties->full_address ?? $properties->place_formatted ?? null;

        if (!$context)
            return $name;

        if (($properties->feature_type ?? null) === 'poi')
            return "{$name} - {$context}";

        return $context;
    }

    /**
     * @throws Exception
     */
    private function curlGet(string $url): string
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
}
